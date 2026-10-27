/** Temporary fixtures verify the real content pipeline; final output is rebuilt without them. */
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root = resolve('.');
const content = join(root, 'src/content/blog');
const fixtures = [
  {
    slug: 'qa-published-one',
    date: '2020-01-01',
    tags: ['backend', 'database'],
    draft: false,
    example: false,
  },
  {
    slug: 'qa-published-two',
    date: '2020-01-02',
    tags: ['backend', 'ai'],
    draft: false,
    example: false,
  },
  { slug: 'qa-draft', date: '2020-01-01', tags: ['backend'], draft: true, example: false },
  { slug: 'qa-future', date: '2099-01-01', tags: ['backend'], draft: false, example: false },
  { slug: 'qa-example', date: '2020-01-01', tags: ['systems'], draft: false, example: true },
];
function blogNav(html) {
  const match = html.match(/<nav\b[^>]*class="blog-nav"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(match, 'Blog navigation missing');
  return [...match[1].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((link) => ({
    href: link[1].match(/href="([^"]+)"/)?.[1],
    current: link[1].match(/aria-current="([^"]+)"/)?.[1],
    count: Number(link[2].match(/<span\b[^>]*>(\d+)<\/span>/)?.[1]),
  }));
}
function build(siteUrl) {
  const buildEnvironment = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
  if (siteUrl !== undefined) buildEnvironment.PUBLIC_SITE_URL = siteUrl;
  return new Promise((resolveBuild, reject) => {
    const child = spawn(
      process.execPath,
      [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'],
      {
        cwd: root,
        env: buildEnvironment,
        stdio: 'inherit',
      },
    );
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolveBuild() : reject(new Error(`Build exited ${code}`)),
    );
  });
}
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
const created = [];
let failure;
try {
  await build('https://site.test');
  const baselineNav = blogNav(await readFile(join(root, 'dist/writing/index.html'), 'utf8'));
  for (const f of fixtures) {
    const path = join(content, `${f.slug}.md`);
    assert.ok(!(await exists(path)), `Fixture path already exists: ${path}`);
    await writeFile(
      path,
      `---\ntitle: '${f.slug} — temporary verification fixture'\ndescription: 'Temporary integration test content; removed after verification.'\npubDate: '${f.date}'\ntags: ${JSON.stringify(f.tags)}\ndraft: ${f.draft}\nexample: ${f.example}\n---\n\n## Verification only\n\nThis fixture is temporary.\n`,
      { flag: 'wx' },
    );
    created.push(path);
  }
  await build('https://site.test');
  for (const f of fixtures) {
    assert.equal(
      await exists(join(root, 'dist/writing', f.slug, 'index.html')),
      !f.draft && !f.example && f.date < '2099',
      `Publication mismatch for ${f.slug}`,
    );
  }
  const rss = await readFile(join(root, 'dist/rss.xml'), 'utf8');
  for (const slug of ['qa-published-one', 'qa-published-two'])
    assert.ok(rss.includes(slug), `${slug} missing in RSS`);
  for (const slug of ['qa-draft', 'qa-future', 'qa-example', 'reading-experience'])
    assert.ok(!rss.includes(slug), `${slug} leaked into RSS`);
  const listing = await readFile(join(root, 'dist/writing/index.html'), 'utf8');
  assert.ok(listing.includes('qa-published-one') && listing.includes('qa-published-two'));
  const first = await readFile(join(root, 'dist/writing/qa-published-one/index.html'), 'utf8');
  assert.ok(first.includes('/writing/qa-published-two/'), 'Adjacent article navigation missing');
  assert.ok(first.includes('https://site.test/writing/qa-published-one/'), 'Canonical missing');
  const tags = await readFile(join(root, 'dist/writing/tags/backend/index.html'), 'utf8');
  assert.ok(tags.includes('qa-published-one'));
  const nav = blogNav(listing);
  const expectedCounts = baselineNav.map((link, index) => link.count + [2, 2, 1, 1, 0][index]);
  assert.equal(nav.length, 5, 'Blog navigation must include all articles and four topics');
  assert.deepEqual(
    nav.map((link) => link.count),
    expectedCounts,
    'Counts must exclude drafts, future posts and examples',
  );
  assert.deepEqual(
    nav.filter((link) => link.current).map((link) => [link.href, link.current]),
    [['/writing/', 'page']],
  );
  for (const slug of ['backend', 'database', 'ai', 'systems']) {
    const html = await readFile(join(root, 'dist/writing/tags', slug, 'index.html'), 'utf8');
    const topicNav = blogNav(html);
    assert.deepEqual(
      topicNav.map((link) => link.count),
      expectedCounts,
      `${slug}: counts changed with the current topic`,
    );
    assert.deepEqual(
      topicNav.filter((link) => link.current).map((link) => [link.href, link.current]),
      [[`/writing/tags/${slug}/`, 'page']],
    );
  }
  assert.deepEqual(
    blogNav(first)
      .filter((link) => link.current)
      .map((link) => [link.href, link.current]),
    [['/writing/tags/backend/', 'location']],
    'Article navigation must identify its topic as a location',
  );
  const example = await readFile(
    join(root, 'dist/writing/examples/reading-experience/index.html'),
    'utf8',
  );
  assert.ok(
    blogNav(example).every((link) => !link.current),
    'Reading examples must not mark a published topic as current',
  );
  const sitemap = await readFile(join(root, 'dist/sitemap-0.xml'), 'utf8');
  assert.ok(sitemap.includes('/writing/qa-published-one/'));
  assert.ok(!sitemap.includes('/examples/'));
  const robots = await readFile(join(root, 'dist/robots.txt'), 'utf8');
  assert.ok(robots.includes('https://site.test/sitemap-index.xml'));
  assert.ok(rss.includes('https://site.test/'));
  console.log(
    'Content workflow passed: publishing, drafts, future dates, topic pages, blog navigation counts and current states, adjacent posts, RSS, canonical, sitemap and robots.',
  );
} catch (error) {
  failure = error;
} finally {
  for (const path of created) await unlink(path);
  // Never leave synthetic posts or a test domain in the delivered build.
  await build();
}
if (failure) throw failure;

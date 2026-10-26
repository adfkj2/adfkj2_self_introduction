/** Temporary fixtures verify the real content pipeline; final output is rebuilt without them. */
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root = resolve('.');
const content = join(root, 'src/content/blog');
const fixtures = [
  { slug: 'qa-published-one', date: '2020-01-01', draft: false, example: false },
  { slug: 'qa-published-two', date: '2020-01-02', draft: false, example: false },
  { slug: 'qa-draft', date: '2020-01-01', draft: true, example: false },
  { slug: 'qa-future', date: '2099-01-01', draft: false, example: false },
];
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
  for (const f of fixtures) {
    const path = join(content, `${f.slug}.md`);
    assert.ok(!(await exists(path)), `Fixture path already exists: ${path}`);
    await writeFile(
      path,
      `---\ntitle: '${f.slug} — temporary verification fixture'\ndescription: 'Temporary integration test content; removed after verification.'\npubDate: '${f.date}'\ntags: ['backend']\ndraft: ${f.draft}\nexample: ${f.example}\n---\n\n## Verification only\n\nThis fixture is temporary.\n`,
      { flag: 'wx' },
    );
    created.push(path);
  }
  await build('https://site.test');
  for (const f of fixtures) {
    assert.equal(
      await exists(join(root, 'dist/writing', f.slug, 'index.html')),
      !f.draft && f.date < '2099',
      `Publication mismatch for ${f.slug}`,
    );
  }
  const rss = await readFile(join(root, 'dist/rss.xml'), 'utf8');
  for (const slug of ['qa-published-one', 'qa-published-two'])
    assert.ok(rss.includes(slug), `${slug} missing in RSS`);
  for (const slug of ['qa-draft', 'qa-future', 'reading-experience'])
    assert.ok(!rss.includes(slug), `${slug} leaked into RSS`);
  const listing = await readFile(join(root, 'dist/writing/index.html'), 'utf8');
  assert.ok(listing.includes('qa-published-one') && listing.includes('qa-published-two'));
  const first = await readFile(join(root, 'dist/writing/qa-published-one/index.html'), 'utf8');
  assert.ok(first.includes('/writing/qa-published-two/'), 'Adjacent article navigation missing');
  assert.ok(first.includes('https://site.test/writing/qa-published-one/'), 'Canonical missing');
  const tags = await readFile(join(root, 'dist/writing/tags/backend/index.html'), 'utf8');
  assert.ok(tags.includes('qa-published-one'));
  const sitemap = await readFile(join(root, 'dist/sitemap-0.xml'), 'utf8');
  assert.ok(sitemap.includes('/writing/qa-published-one/'));
  assert.ok(!sitemap.includes('/examples/'));
  const robots = await readFile(join(root, 'dist/robots.txt'), 'utf8');
  assert.ok(robots.includes('https://site.test/sitemap-index.xml'));
  assert.ok(rss.includes('https://site.test/'));
  console.log(
    'Content workflow passed: publishing, drafts, future dates, topic pages, adjacent posts, RSS, canonical, sitemap and robots.',
  );
} catch (error) {
  failure = error;
} finally {
  for (const path of created) await unlink(path);
  // Never leave synthetic posts or a test domain in the delivered build.
  await build();
}
if (failure) throw failure;

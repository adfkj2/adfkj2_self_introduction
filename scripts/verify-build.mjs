import { readdir, readFile, access } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name))),
    )
  ).flat();
}
const files = await walk(root);
const htmlFiles = files.filter((f) => extname(f) === '.html');
const documents = new Map(
  await Promise.all(htmlFiles.map(async (file) => [file, await readFile(file, 'utf8')])),
);
const errors = [];
let links = 0;
for (const [file, html] of documents) {
  const relative = file.slice(root.length).replaceAll('\\', '/');
  const source = relative.endsWith('/index.html') ? relative.slice(0, -10) : relative;
  if (!html.includes('http-equiv="refresh"')) {
    assert.match(html, /<html[^>]*lang="zh-CN"/, `${relative}: Chinese language missing`);
  }
  assert.match(html, /<title>[^<]+<\/title>/, `${relative}: title missing`);
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1];
    if (!href || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(href)) continue;
    const url = new URL(href, 'http://localhost' + source);
    let pathname = decodeURIComponent(url.pathname);
    let target = join(root, pathname);
    if (pathname.endsWith('/')) target = join(target, 'index.html');
    else if (!extname(target)) target = join(target, 'index.html');
    try {
      await access(target);
      links++;
      if (url.hash && extname(target) === '.html') {
        const targetHtml = documents.get(target) || (await readFile(target, 'utf8'));
        const id = decodeURIComponent(url.hash.slice(1));
        if (!targetHtml.includes(`id="${id}"`))
          errors.push(`${source}: missing #${id} in ${pathname}`);
      }
    } catch {
      errors.push(`${source}: missing ${href}`);
    }
  }
}
for (const path of [
  'index.html',
  'projects/index.html',
  'projects/dive/index.html',
  'projects/medical/index.html',
  'projects/tickets/index.html',
  'projects/better-one/index.html',
  'writing/index.html',
  'writing/examples/reading-experience/index.html',
  'about/index.html',
  'rss.xml',
  'robots.txt',
  '404.html',
])
  await access(join(root, path));
const example = await readFile(
  join(root, 'writing/examples/reading-experience/index.html'),
  'utf8',
);
assert.match(example, /name="robots" content="noindex, follow"/);
const legacyBlog = await readFile(join(root, 'blog/index.html'), 'utf8');
assert.match(legacyBlog, /name="robots" content="noindex, follow"/);
assert.match(legacyBlog, /rel="canonical" href="[^"]*\/writing\/"/);
assert.match(legacyBlog, /http-equiv="refresh" content="0; url=\/writing\/"/);
const homeDoc = await readFile(join(root, 'index.html'), 'utf8');
assert.match(homeDoc, /"@type":"Person"/);
const projectDoc = await readFile(join(root, 'projects/tickets/index.html'), 'utf8');
assert.match(projectDoc, /"@type":"BreadcrumbList"/);
const rss = await readFile(join(root, 'rss.xml'), 'utf8');
assert.ok(!rss.includes('reading-experience'), 'Example leaked into RSS');
const home = await readFile(join(root, 'index.html'), 'utf8');
assert.ok(!home.includes('Hello, Astronaut!'), 'Starter hero leaked');
assert.equal(errors.length, 0, errors.join('\n'));
console.log(
  `Static verification passed: ${htmlFiles.length} HTML documents, ${links} local links/assets, required routes, example isolation and RSS.`,
);

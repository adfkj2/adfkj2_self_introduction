// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');
const site = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || undefined;
if (site) {
  const url = new URL(site);
  if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/')
    throw new Error('PUBLIC_SITE_URL must be an http(s) origin without a subpath.');
}
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    ...(site
      ? [
          sitemap({
            // 分类页在还没有正式文章时会被索引成空页面；发布文章后移除 /writing/tags/ 过滤。
            filter: (url) =>
              !url.includes('/examples/') &&
              !url.includes('/404') &&
              !url.includes('/blog/') &&
              !url.includes('/writing/tags/'),
          }),
        ]
      : []),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
});

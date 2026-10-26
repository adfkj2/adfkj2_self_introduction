import { getPublishedPosts, postUrl } from '../utils/posts';
import rss from '@astrojs/rss';
import { site } from '../data/site';
/** @type {import('astro').APIRoute} */
export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site || context.url.origin,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}

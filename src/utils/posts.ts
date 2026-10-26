import { getCollection, type CollectionEntry } from 'astro:content';
export type Post = CollectionEntry<'blog'>;
export const isPublished = (post: Post) =>
  !post.data.draft && !post.data.example && post.data.pubDate.getTime() <= Date.now();
export async function getPublishedPosts() {
  return (await getCollection('blog'))
    .filter(isPublished)
    .sort(
      (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.id.localeCompare(b.id),
    );
}
export function readingTime(body = '') {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.match(/[a-zA-Z0-9]+(?:['’-][a-zA-Z0-9]+)*/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 400 + words / 220));
}
export const postUrl = (post: Post) =>
  `/writing/${post.data.example ? 'examples/' : ''}${post.id}/`;

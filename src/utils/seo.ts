import { profile, topics } from '../data/site';
import type { Project } from '../data/projects';

const personRef = {
  '@type': 'Person',
  name: profile.name || profile.handle,
  alternateName: profile.handle,
  url: profile.github,
};

export function personJsonLd(url?: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name || profile.handle,
    alternateName: profile.handle,
    jobTitle: profile.role,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    url: url?.href,
    sameAs: [profile.github],
    alumniOf: { '@type': 'CollegeOrUniversity', name: profile.university },
    knowsAbout: topics.map((topic) => topic.label),
  };
}

export function projectJsonLd(project: Project, site?: URL) {
  const pageUrl = site ? new URL(`/projects/${project.slug}/`, site).href : undefined;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Projects',
          item: site ? new URL('/projects/', site).href : undefined,
        },
        { '@type': 'ListItem', position: 2, name: project.name, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.name,
      description: `${project.subtitle}。${project.description}`,
      url: pageUrl,
      codeRepository: project.github,
      keywords: project.tags.join(', '),
      author: personRef,
    },
  ];
}

export function articleJsonLd(options: {
  title: string;
  description: string;
  url?: string;
  published?: Date;
  updated?: Date;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: options.title,
    description: options.description,
    url: options.url,
    image: options.image,
    datePublished: options.published?.toISOString(),
    dateModified: options.updated?.toISOString(),
    author: personRef,
    publisher: personRef,
  };
}

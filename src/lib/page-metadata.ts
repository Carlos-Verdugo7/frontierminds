import type { Metadata } from 'next';

type SharePage = { path: string; title: string; description: string; locale: string };

export function pageMetadata(page: SharePage, imagePath = '/opengraph-image'): Metadata {
  const url = 'https://www.frontierminds.io' + page.path;
  const image = 'https://www.frontierminds.io' + imagePath;
  const title = page.title + ' | FrontierMinds';
  return {
    title, description: page.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName: 'FrontierMinds', url, title, description: page.description,
      locale: page.locale, images: [{ url: image, width: 1200, height: 630, alt: page.title }] },
    twitter: { card: 'summary_large_image', title, description: page.description, images: [image] },
  };
}

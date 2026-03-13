import type { Metadata } from 'next';
import { SITE } from './constants';

export function createMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  const desc = description || SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = image || SITE.ogImage;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

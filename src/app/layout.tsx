import type { Metadata } from 'next';
import { archivo, plexSans, plexMono } from '@/lib/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StructuredData } from '@/components/seo/StructuredData';
import { SITE, COMPANY } from '@/lib/constants';
import { services } from '@/data/services';
import './globals.css';

const hasRealPhone = !/[Xx]/.test(COMPANY.phone);
const hasRealAlt = !!COMPANY.phoneAlt && !/[Xx]/.test(COMPANY.phoneAlt);

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Dual-Fuel Marine Engine Specialists`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Dual-Fuel Marine Engine Specialists`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}#organization`,
  name: COMPANY.name,
  alternateName: COMPANY.shortName,
  url: SITE.url,
  logo: `${SITE.url}/images/logo.png`,
  image: `${SITE.url}${SITE.ogImage}`,
  description: SITE.description,
  slogan: COMPANY.tagline,
  areaServed: {
    '@type': 'Country',
    name: 'United Arab Emirates',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street || undefined,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state || undefined,
    addressCountry: COMPANY.address.country,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: COMPANY.email,
      contactType: 'customer service',
      availableLanguage: ['English'],
      ...(hasRealPhone ? { telephone: COMPANY.phone } : {}),
    },
    ...(hasRealAlt
      ? [
          {
            '@type': 'ContactPoint',
            telephone: COMPANY.phoneAlt,
            contactType: 'emergency',
            availableLanguage: ['English'],
          },
        ]
      : []),
  ],
  makesOffer: services.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.shortDescription,
      serviceType: 'Marine engine maintenance',
      provider: { '@id': `${SITE.url}#organization` },
    },
  })),
  knowsAbout: [
    'Dual-fuel marine engines',
    'LNG propulsion systems',
    'Marine engine overhaul',
    '4-stroke dual-fuel platforms',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}#organization` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--color-ink-400)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white">Skip to content</a>
        <StructuredData data={professionalServiceSchema} />
        <StructuredData data={websiteSchema} />
        <Header />
        <main id="main" tabIndex={-1} className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { inter, lora } from '@/lib/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StructuredData } from '@/components/seo/StructuredData';
import { SITE, COMPANY } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Wärtsilä Dual-Fuel Engine Specialists`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Wärtsilä Dual-Fuel Engine Specialists`,
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: SITE.url,
  logo: `${SITE.url}/images/logo-dark.svg`,
  description: SITE.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    addressCountry: COMPANY.address.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: COMPANY.phone,
    email: COMPANY.email,
    contactType: 'customer service',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="antialiased">
        <StructuredData data={organizationSchema} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

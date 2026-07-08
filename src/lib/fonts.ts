import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';

// Premium industrial type system: Archivo (a grotesque with engineering
// character) as the display voice, IBM Plex Sans for body, Plex Mono for data.
export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

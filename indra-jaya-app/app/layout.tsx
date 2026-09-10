import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE = 'https://www.indrajayakenarimas.com'
const DESCRIPTION =
  'SUMATO, alat pemadam api cerdas yang bekerja otomatis dan memadamkan api dalam 5 detik. Bersertifikat nasional & internasional. Distributor Indra Jaya Kenari Mas, Jakarta.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Indra Jaya · SUMATO Smart Fire Extinguisher',
    template: '%s · Indra Jaya Kenari Mas',
  },
  description: DESCRIPTION,
  applicationName: 'Indra Jaya Kenari Mas',
  keywords: [
    'SUMATO',
    'alat pemadam api',
    'pemadam api cerdas',
    'pemadam api otomatis',
    'smart fire extinguisher',
    'alat pemadam api ringan',
    'APAR',
    'body harness',
    'safety tools',
    'perlengkapan keselamatan kerja',
    'Indra Jaya Kenari Mas',
    'Jakarta',
  ],
  authors: [{ name: 'Indra Jaya Kenari Mas' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE,
    siteName: 'Indra Jaya Kenari Mas',
    title: 'SUMATO · Alat Pemadam Api Cerdas',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUMATO · Alat Pemadam Api Cerdas',
    description: DESCRIPTION,
  },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#f6f2ea',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}

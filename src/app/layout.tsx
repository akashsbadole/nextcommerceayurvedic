import type { Metadata } from 'next'
import { Fraunces, Work_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SiteHeader } from '@/components/store/SiteHeader'
import { SiteFooter } from '@/components/store/SiteFooter'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})
const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Vedika Ayurveda — Classical Formulations for Modern Rituals',
    template: '%s · Vedika Ayurveda',
  },
  description:
    '120+ Ayurvedic skin, hair and wellness products formulated per classical texts. Free shipping across India above ₹799.',
  keywords: ['Ayurveda', 'natural skincare', 'hair care', 'wellness', 'India', 'dosha'],
  openGraph: {
    title: 'Vedika Ayurveda',
    description: 'Classical Ayurvedic formulations for modern daily rituals.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <Providers>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}

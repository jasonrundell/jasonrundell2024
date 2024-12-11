import React from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import MainNav from '../components/MainNav'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    console.log('react-axe loaded')
    axe.default(React, window, 1000)
  })
}

import './globals.css'

export const metadata: Metadata = {
  title: 'Demo Store',
  description: 'Demo store with demo products',
}

const Footer = dynamic(() => import('../components/Footer'))
const Meta = dynamic(() => import('../components/Meta'))

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics gaId="G-GZFPYCJVHQ" />
        <Meta />
        <MainNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

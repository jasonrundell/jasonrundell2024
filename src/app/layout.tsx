import React from 'react'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { globalCss } from '@pigment-css/react'

import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'
import Tokens from '@/lib/tokens'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    console.log('react-axe loaded')
    axe.default(React, window, 1000)
  })
}

globalCss`
  :root {
  --text-color: ${Tokens.colors.text};
  --background-color: ${Tokens.colors.background};
  --background-color-2: ${Tokens.colors.background2};
  --background-color-3: ${Tokens.colors.background3};
  --size-large: ${Tokens.sizes.large}rem;
  --size-normal: ${Tokens.sizes.medium}rem;
  --size-small: ${Tokens.sizes.small}rem;
  --size-smallest: ${Tokens.sizes.xsmall}rem;
  --primary-color: ${Tokens.colors.primary};
  --secondary-color: ${Tokens.colors.secondary};
}

html,
body {
  font-size: ${Tokens.sizes.fontSize.base};
  background-color: ${Tokens.colors.background};
  color: ${Tokens.colors.text};
  margin: ${Tokens.sizes.padding.xlarge}rem 0 0;
}

p {
  margin: 0 0 ${Tokens.sizes.small}rem 0;
}

h2,
h3,
h4,
time {
  color: ${Tokens.colors.secondary};
  font-weight: 400;
}

a {
  color: ${Tokens.colors.primary};
  text-decoration: underline;
}

@property --background-color-start {
  syntax: '<color>';
  initial-value: ${Tokens.colors.background};
  inherits: false;
}

@property --background-color-end {
  syntax: '<color>';
  initial-value: ${Tokens.colors.background};
  inherits: false;
}

#menu {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: ${Tokens.colors.background};
  transition: background 1.3s ease, --background-color-start 1.3s ease,
    --background-color-end 1.3s ease;
}

#menu.scrolled {
  background: linear-gradient(
    180deg,
    var(--background-color-start) 0%,
    var(--background-color-end) 100%
  );
  --background-color-start: ${Tokens.colors.background};
  --background-color-end: ${Tokens.colors.background3};
}

#menu:not(.scrolled) {
  --background-color-start: ${Tokens.colors.background};
  --background-color-end: ${Tokens.colors.background};
}

.decoration--none {
  text-decoration: none;
}

.youtube-embed {
  display: block;
  width: 100%;
  height: 18.75rem;
}

.rounded-full {
  border-radius: 9999px;
}

.font-bold {
  font-weight: bold;
}

@media (min-width: ${Tokens.sizes.breakpoints.medium}rem) {
  .youtube-embed {
    height: 31.25rem;
  }
}
`

import '@jasonrundell/dropship/style.css'

import MainNav from '@/components/MainNav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

const outfit = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-GZFPYCJVHQ" />
        <MainNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

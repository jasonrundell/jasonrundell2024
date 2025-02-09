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
  --text-color: ${Tokens.colors.textPrimary.value};
  --background-color: ${Tokens.colors.background.value};
  --background-color-2: ${Tokens.colors.backgroundDark.value};
  --background-color-3: ${Tokens.colors.backgroundDarker.value};
  --size-large: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
  --size-normal: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  --size-small: ${Tokens.sizes.small.value}${Tokens.sizes.small.unit};
  --size-smallest: ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit};
  --primary-color: ${Tokens.colors.primary.value};
  --secondary-color: ${Tokens.colors.secondary.value};
}

html,
body {
  font-size: ${Tokens.sizes.fonts.base.value}${Tokens.sizes.fonts.base.unit};
  background-color: ${Tokens.colors.background.value};
  color: ${Tokens.colors.textPrimary.value};
  margin: ${Tokens.sizes.padding.xlarge.value}${Tokens.sizes.padding.xlarge.unit} 0 0;
}

p {
  margin: 0 0 ${Tokens.sizes.small.value}${Tokens.sizes.small.unit} 0;
}

h2,
h3,
h4,
time {
  color: ${Tokens.colors.secondary.value};
  font-weight: 400;
}

a {
  color: ${Tokens.colors.primary.value};
  text-decoration: underline;
  word-break: break-word;
}

hr {
  width: 100%;
  margin-bottom: ${Tokens.sizes.large.value}${Tokens.sizes.large.unit};
}

@property --background-color-start {
  syntax: '<color>';
  initial-value: ${Tokens.colors.background.value};
  inherits: false;
}

@property --background-color-end {
  syntax: '<color>';
  initial-value: ${Tokens.colors.background.value};
  inherits: false;
}

#menu {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: ${Tokens.colors.background.value};
  transition: background 1.3s ease, --background-color-start 1.3s ease,
    --background-color-end 1.3s ease;
}

#menu.scrolled {
  background: linear-gradient(
    180deg,
    var(--background-color-start) 0%,
    var(--background-color-end) 100%
  );
  --background-color-start: ${Tokens.colors.background.value};
  --background-color-end: ${Tokens.colors.backgroundDarker.value};
}

#menu:not(.scrolled) {
  --background-color-start: ${Tokens.colors.background.value};
  --background-color-end: ${Tokens.colors.background.value};
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

@media (min-width: ${Tokens.sizes.breakpoints.medium.value}${Tokens.sizes.breakpoints.medium.unit}) {
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

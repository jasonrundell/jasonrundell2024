import React from 'react'
import Head from 'next/head'
import { GoogleAnalytics } from '@next/third-parties/google'
import '../styles/index.css'

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  import('react-axe').then((axe) => {
    console.log('react-axe loaded')
    axe.default(React, window, 1000)
  })
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GoogleAnalytics trackingId="G-GZFPYCJVHQ" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

//
// _document.tsx
//

import { Html, Head, Main, NextScript } from "next/document"
import { PRIMARY_LIGHTEST } from "../components/theme"

// To use material icons from fonts add link below (slows initial page loading)
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:image" content="/branding/banner.png" />
        <meta name="theme-color" content={PRIMARY_LIGHTEST} />
        <meta name="google_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
          as="style"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

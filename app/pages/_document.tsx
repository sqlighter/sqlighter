// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document"

const CUSTOM_FONTS =
  "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"

// To use material icons from fonts add link below (slows initial page loading)
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

export default function Document() {
  return (
    <Html>
      <Head>
        <link href={CUSTOM_FONTS} rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

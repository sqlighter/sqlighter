// pages/_document.js

import { Html, Head, Main, NextScript } from "next/document"
import { Theme, SxProps } from "@mui/material/styles"
import { customSx } from "../components/theme"
import Box from "@mui/material/Box"

// To use material icons from fonts add link below (slows initial page loading)
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

const documentSx: SxProps<Theme> = {
  ...customSx,
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "white",
}

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonimous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300;8..144,400;8..144,500&display=swap"
          rel="stylesheet"
          as="style"
        />
      </Head>
      <body>
        <Box sx={documentSx}>
          <Main />
        </Box>
        <NextScript />
      </body>
    </Html>
  )
}

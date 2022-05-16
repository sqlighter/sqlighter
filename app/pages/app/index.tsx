//
// app.tsx - sqlighter as a full page application
//

import * as React from "react"
import dynamic from "next/dynamic"

// import { Main  } from "../../components/sqlighter/main"
// TODO load using <Suspense /> that shows a loading screen
// https://nextjs.org/docs/advanced-features/dynamic-import

const SSR = typeof window === "undefined"


const MainComponentWithoutSSR = dynamic(
  () => import('../../components/sqlighter/main'),
  { ssr: false }
)

const title = "SQLighter"

export default function AppPage(props) {
  return <MainComponentWithoutSSR {...props} />
}

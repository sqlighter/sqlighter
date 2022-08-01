//
// app.tsx - sqlighter as a full page application
//

import * as React from "react"
import { Suspense } from "react"
import Script from "next/script"
import dynamic from "next/dynamic"

import { Empty } from "../components/ui/empty"

// import { Main  } from "../../components/sqlighter/main"
// TODO load using <Suspense /> that shows a loading screen
// https://nextjs.org/docs/advanced-features/dynamic-import

const MainComponentWithoutSSR = dynamic(() => import("../components/sqlighter"), { ssr: false })

export default function AppPage(props) {
  const empty = <Empty icon="sqlighter" title="Loading..." />
  return (
    <>
      <Suspense fallback={empty}>
        <Script type="module" strategy="beforeInteractive" src="/sql-loader.js" />
        <MainComponentWithoutSSR {...props} />
      </Suspense>
    </>
  )
}

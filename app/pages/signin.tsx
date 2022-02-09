//
// signinpage.tsx
//

import React, { useContext } from "react"
import Layout from "../components/layout"
import { SigninPanel } from "../components/signin"

// TODO redirect to /browse once signed in

export default function SigninPage() {
  return (
    <Layout title="Signin">
      <SigninPanel />
    </Layout>
  )
}

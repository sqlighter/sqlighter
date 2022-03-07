//
// signinpage.tsx
//

import React, { useContext } from "react"
import { AppLayout } from "../components/layouts"
import { SigninPanel } from "../components/signin"

// TODO redirect to /browse once signed in

export default function SigninPage() {
  return (
    <AppLayout title="Signin">
      <SigninPanel />
    </AppLayout>
  )
}

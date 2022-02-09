//
// header.tsx
//

import * as React from "react"
import Stack from "@mui/material/Stack"

import { Avatar } from "../components/avatar"
import { Context } from "../components/context"

export function Header() {
  const context = React.useContext(Context)

  return (
    <header>
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Avatar user={context.user} />
      </Stack>
    </header>
  )
}

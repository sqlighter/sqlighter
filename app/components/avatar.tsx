//
// avatar.tsx
//

import { useRouter } from "next/router"
import * as React from "react"
import IconButton from "@mui/material/IconButton"
import MuiAvatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import { getDisplayName, getProfileImageUrl } from "./signin"

export function Avatar({ user }) {
  const router = useRouter()

  function handleClick(event) {
    router.push(user ? "/profile" : "/signin")
  }

  return (
    <Tooltip title={getDisplayName(user)}>
      <IconButton onClick={handleClick} size="small">
        <MuiAvatar alt={getDisplayName(user)} src={getProfileImageUrl(user)} />
      </IconButton>
    </Tooltip>
  )
}

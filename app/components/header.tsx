//
//
//

import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"

import { Context } from "../components/context"

const Header = () => {
  const context = React.useContext(Context)
  const displayName = context.user?.attributes?.passport?.displayName || ""
  const imageUrl = context.user?.attributes?.passport?.photos?.[0]?.value

  return (
    <header>
      <Stack direction="row" spacing={2}>
        <Tooltip title={displayName}>
          <Avatar alt={displayName} src={imageUrl} />
        </Tooltip>
      </Stack>
    </header>
  )
}

export default Header

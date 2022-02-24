//
// menu.tsx - contents of left drawer (secondary navigation menu)
//

import { Fragment, useContext, useState } from "react"
import { useRouter } from "next/router"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Slide from "@mui/material/Slide"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import SearchIcon from "@mui/icons-material/SearchOutlined"

import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"

import { Avatar } from "./avatar"
import { Context } from "./context"
import { Logo } from "./logo"

export function Menu({ onClose }) {
  const context = useContext(Context)
  const router = useRouter()

  const user = context.user

  return (
    <Box sx={{ width: 240 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
      <Box height={128} display="flex">
        <Box ml={2} alignSelf="flex-end">
          <Logo organizationId="american-hearth-association" width={96} height={96} />
        </Box>
      </Box>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      {user && <Box>has user</Box>}
    </Box>
  )
}

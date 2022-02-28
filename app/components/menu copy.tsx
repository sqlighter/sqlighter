//
// menu.tsx - contents of left drawer (secondary navigation menu)
//

import { Fragment, useContext, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import useSWR from "swr"

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
import Icon from "@mui/material/Icon"
import LogoutIcon from "@mui/icons-material/LogoutOutlined"

import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"

import ListItemButton from "@mui/material/ListItemButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"

import MuiAvatar from "@mui/material/Avatar"

//import { Avatar } from "./avatar"
import { Context } from "./context"
import { Logo } from "./logo"
import { GenericList, GenericListItem, getAvatarImage } from "./listitems"

import { useApi } from "../lib/api"
import { getIcon } from "./icon"
import { PRIMARY_LIGHTER, BORDER_RADIUS_FANCY } from "../components/theme"

const LIST_ITEM_BUTTON_SX = { marginLeft: -2, borderStartEndRadius: 48, borderEndEndRadius: 48 }

export function MenuItem({ item }) {
  const router = useRouter()

  if (item.type == "section") {
    return (
      <Box ml={2} mt={3}>
        <Typography variant="overline">{item.title}</Typography>
      </Box>
    )
  }

  if (item.type == "space") {
    return <Box minHeight={16}></Box>
  }

  const primary = <Typography variant="body1">{item.title}</Typography>
  const icon = item.imageUrl.substring("icon://".length)
  const selected = router.pathname.startsWith(item.url)

  return (
    <Link href={item.url} passHref>
      <ListItemButton selected={selected} sx={LIST_ITEM_BUTTON_SX} dense={true}>
        <ListItem alignItems="center">
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={primary} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

export function Menu({ onClose }) {
  const context = useContext(Context)
  const router = useRouter()

  const user = context.user

  const { data: menu } = useApi("/api/ux/menu")

  function getUserProfileItem() {
    const email = user?.id
    const displayName = user?.attributes?.passport?.displayName || ""
    const imageUrl = user?.attributes?.passport?.photos?.[0]?.value
    const signoutButton = (
      <IconButton edge="end" title="Sign Out" onClick={(e) => context.signout("/library")}>
        <LogoutIcon />
      </IconButton>
    )

    return (
      <Box sx={{ position: "absolute", bottom: 0, height: 96 }} mr={2}>
        <List dense disablePadding>
          <ListItemButton sx={LIST_ITEM_BUTTON_SX} dense={true}>
            <ListItem alignItems="center" secondaryAction={signoutButton}>
              <ListItemAvatar>
                <MuiAvatar alt={displayName} src={imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={displayName} secondary={email} />
            </ListItem>
          </ListItemButton>
        </List>
      </Box>
    )
  }

  return (
    <Box sx={{ width: 300 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
      <Box height={128} display="flex" sx={{ position: "relative" }}>
        <Box ml={2} alignSelf="flex-end">
          <Logo organizationId="american-hearth-association" width={96} height={96} />
        </Box>
      </Box>

      {menu && (
        <Box mr={2}>
          <List dense disablePadding>
            {menu.map((item, idx) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </List>
        </Box>
      )}

      {user && getUserProfileItem()}
    </Box>
  )
}

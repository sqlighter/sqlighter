//
// header.tsx
//

import { Fragment, useContext, useState } from "react"
import { useRouter } from "next/router"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Drawer from "@mui/material/Drawer"
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
import MenuIcon from "@mui/icons-material/Menu"

import { getDisplayName, getProfileImageUrl } from "./signin"
import { Context } from "./context"
import { Menu } from "./menu"

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

type Anchor = "top" | "left" | "bottom" | "right"

export function Header(props) {
  const context = useContext(Context)
  const router = useRouter()

  // open or close navigation drawer
  const [open, setDrawer] = useState(false)

  /** Show menu icon (hamburger) or user's avatar if logged in */
  function getMenuIcon() {
    if (context.user) {
      const displayName = getDisplayName(context.user)
      const profileImageUrl = getProfileImageUrl(context.user)
      return (
        <IconButton onClick={(e) => setDrawer(true)}>
          <Avatar alt={displayName} src={profileImageUrl} />
        </IconButton>
      )
    }
    return (
      <IconButton onClick={(e) => setDrawer(true)} color="inherit">
        <MenuIcon />
      </IconButton>
    )
  }

  return (
    <header>
      <Fragment key="left">
        <HideOnScroll {...props}>
          <AppBar>
            <Container maxWidth="sm">
              <Toolbar disableGutters>
                {getMenuIcon()}
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton color="inherit" onClick={(e) => router.push("/search")}>
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </HideOnScroll>
        <Toolbar />
        <Drawer anchor={"left"} open={open} onClose={(e) => setDrawer(false)}>
          <Menu onClose={(e) => setDrawer(false)} />
        </Drawer>
      </Fragment>
    </header>
  )
}

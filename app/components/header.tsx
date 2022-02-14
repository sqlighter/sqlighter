//
// header.tsx
//

import { useRouter } from "next/router"
import { useContext, useState } from "react"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Slide from "@mui/material/Slide"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

import SearchIcon from "@mui/icons-material/SearchOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined"

import { getDisplayName, getProfileImageUrl } from "./signin"
import { Context } from "./context"
import { Menu } from "./menu"

export const HEADER_SMALL_HEIGHT = 64
export const HEADER_LARGE_HEIGHT = 128

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export interface HeaderProps {
  title?: string

  subtitle?: string

  back?: boolean | string
}

export function Header(props: HeaderProps) {
  const context = useContext(Context)
  const router = useRouter()

  // open or close navigation drawer
  const [open, setDrawer] = useState(false)

  function goBack(e) {
    // TODO if props.back is an url, go to that url, if backstack empty, go to /browse
    router.back()
  }

  /** Show menu icon (hamburger) or user's avatar if logged in */
  function getMenuIcon() {
    if (props.back) {
      return (
        <IconButton onClick={goBack} color="inherit" edge="start">
          <ArrowBackIcon />
        </IconButton>
      )
    }

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
      <IconButton onClick={(e) => setDrawer(true)} color="inherit" edge="start">
        <MenuIcon />
      </IconButton>
    )
  }

  let headerHeight = props.title ? HEADER_LARGE_HEIGHT : HEADER_SMALL_HEIGHT

  // wrap appbar in <HideOnScroll {...props}> to make it disappear on scroll
  // TODO move AppBar.boxShadow to _app.js' custom theme
  return (
    <header>
      <AppBar sx={{ boxShadow: 0 }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters sx={{ height: headerHeight }}>
            <Stack sx={{ display: "flex", flexGrow: 1, marginBottom: 0 }}>
              <Box sx={{ display: "flex", flexGrow: 1, marginBottom: 1 }}>
                {getMenuIcon()}
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { md: "flex" } }}>
                  <IconButton color="inherit" edge="end" onClick={(e) => router.push("/search")}>
                    <SearchIcon />
                  </IconButton>
                </Box>
              </Box>
              {props.title && (
                <Typography variant="h5" color="text.primary" noWrap={true}>
                  {props.title}
                </Typography>
              )}
              {props.subtitle && (
                <Typography variant="body2" color="text.secondary" noWrap={true}>
                  {props.subtitle}
                </Typography>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ height: headerHeight }} />
      <Drawer anchor={"left"} open={open} onClose={(e) => setDrawer(false)}>
        <Menu onClose={(e) => setDrawer(false)} />
      </Drawer>
    </header>
  )
}

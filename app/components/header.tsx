//
// header.tsx
//

import { useRouter } from "next/router"
import { useContext, useState, useEffect, useRef } from "react"

import useScrollTrigger from "@mui/material/useScrollTrigger"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Slide from "@mui/material/Slide"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import SearchIcon from "@mui/icons-material/SearchOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"

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
  /** Large title to be shown in header */
  title?: string

  /** Smaller subtitle shown under title (optional) */
  subtitle?: string

  /** True if back icon is to be shown (default false, menu icon is shown) */
  back?: boolean

  /** True if header should support search */
  search?: boolean

  /** Additional actions to be placed on the right hand side of the toolbar */
  actions?: any
}

export function Header(props: HeaderProps) {
  const router = useRouter()

  // open or close navigation drawer
  const [open, setDrawer] = useState(false)

  // input field showing search query
  const searchRef = useRef()

  // search is a controlled text field and is also shown in query as ?search=
  const [search, setSearch] = useState(router.query.search)
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // just route is updated, update local state, focuse on search box
  useEffect(() => {
    setSearch(router.query.search)
    if (search != undefined && searchRef.current) {
      ;(searchRef.current as HTMLButtonElement).focus()
    }
  }, [router])

  // when search text typed by user changes, update ?search= in query string
  useEffect(() => {
    if (search != undefined) {
      router.query.search = search
    } else {
      delete router.query.search
    }
    router.replace(router)
  }, [search])

  function getSearchToolbar() {
    return (
      <Stack sx={{ display: "flex", flexGrow: 1, marginTop: 1 }}>
        <Box sx={{ display: "flex", flexGrow: 1, marginBottom: 1 }}>
          <IconButton color="inherit" edge="start" onClick={(e) => setSearch("")}>
            <SearchIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box>
            <IconButton onClick={(e) => setSearch(undefined)} color="inherit" edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <TextField
          id="search"
          variant="standard"
          placeholder="Search"
          value={search}
          onChange={onSearchChange}
          inputRef={searchRef}
          autoFocus={true}
          InputProps={{ disableUnderline: true, style: { fontSize: "2rem", fontWeight: 700 } }}
          fullWidth
        />
      </Stack>
    )
  }

  function getHeaderToolbar() {
    return (
      <Stack sx={{ display: "flex", flexGrow: 1, marginTop: 1 }}>
        <Box sx={{ display: "flex", flexGrow: 1, marginBottom: 1 }}>
          {props.back ? (
            <IconButton onClick={(e) => router.back()} color="inherit" edge="start">
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <IconButton onClick={(e) => setDrawer(true)} color="inherit" edge="start">
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {props.search && (
            <IconButton color="inherit" edge={props.actions ? undefined : "end"} onClick={(e) => setSearch("")}>
              <SearchIcon />
            </IconButton>
          )}
          {props.actions}
        </Box>
        <Typography variant="h3" color="text.primary" noWrap={true}>
          {props.title || "\xa0"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap={true}>
          {props.subtitle || "\xa0"}
        </Typography>
      </Stack>
    )
  }

  // wrap appbar in <HideOnScroll {...props}> to make it disappear on scroll
  // TODO move AppBar.boxShadow to _app.js' custom theme
  return (
    <header>
      <AppBar sx={{ boxShadow: 0 }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters sx={{ height: HEADER_LARGE_HEIGHT, alignItems: "flex-start" }}>
            {search != undefined ? getSearchToolbar() : getHeaderToolbar()}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ height: HEADER_LARGE_HEIGHT, marginBottom: 2 }} />
      <Drawer anchor={"left"} open={open} onClose={(e) => setDrawer(false)}>
        <Menu onClose={(e) => setDrawer(false)} />
      </Drawer>
    </header>
  )
}

/*

              <TextField
                id="search"
                label="Search"
                variant="standard"
                value={search}
                InputProps={{ disableUnderline: true }}
                onChange={onSearchChange}
                fullWidth
                focused={search != undefined}
                autoFocus={true}
              />

            <InputBase
              inputRef={searchRef}
              autoFocus={true}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search 'Glucose'"
              inputProps={{ "aria-label": "search google maps" }}
              value={search}
              onChange={onSearchChange}
            />




              */

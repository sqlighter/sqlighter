//
// layouts.tsx - shared layout components for app and website pages
//

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"

import Container from "@mui/material/Container"
import { Theme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Toolbar from "@mui/material/Toolbar"
import SearchIcon from "@mui/icons-material/SearchOutlined"
import ArrowBackIcon from "@mui/icons-material/ArrowBackOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import Typography from "@mui/material/Typography"

import { Footer } from "./footer"
import { SearchResults } from "./search"

export const TITLE = "sqlighter"
export const HEADER_SMALL_HEIGHT = 64
export const HEADER_LARGE_HEIGHT = 128
export const DRAWER_WIDTH = 280

export function useSearch(search?: string) {
  const router = useRouter()
  useEffect(() => {
    if (search != undefined) {
      router.query.search = search
      router.replace(router)
    }
  }, [router])

  return [router.query.search as string]
}

interface LayoutProps {
  /** Page title */
  title?: string

  /** Brief description shown in page's header */
  description?: string

  /** Layout contents */
  children: React.ReactNode

  /** True if back icon should be shown */
  showBack?: boolean

  /** Additional actions to be placed on the right hand side of the toolbar */
  actions?: any
}

/** A shared layout for all application pages, includes: menu drawer, header, footer, basic actions */
export function AppLayout({ children, title, description: subtitle, showBack, actions }: LayoutProps) {
  // search query entered in header if any
  const [query] = useSearch()

  // layout changes on medium and large screens
  const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))

  // use ?search= to drive search box
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
          id="search-field"
          type="search"
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
          {showBack ? (
            <IconButton onClick={(e) => router.back()} color="inherit" edge="start">
              <ArrowBackIcon />
            </IconButton>
          ) : (
            !isMediumScreen && (
              <IconButton onClick={(e) => setDrawer(true)} color="inherit" edge="start">
                <MenuIcon />
              </IconButton>
            )
          )}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" edge={actions ? undefined : "end"} onClick={(e) => setSearch("")}>
            <SearchIcon />
          </IconButton>
          {actions}
        </Box>
        <Typography variant="h3" color="text.primary" noWrap={true}>
          {title || "\xa0"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap={true}>
          {subtitle || "\xa0"}
        </Typography>
      </Stack>
    )
  }

  const pageTitle = title ? `${title} | ${TITLE}` : TITLE
  title = title || TITLE

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="Biomarkers" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <AppBar sx={{ boxShadow: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` } }}>
          <Toolbar sx={{ height: HEADER_LARGE_HEIGHT, alignItems: "flex-start", maxWidth: 600 }}>
            {search != undefined ? getSearchToolbar() : getHeaderToolbar()}
          </Toolbar>
        </AppBar>
        <Toolbar sx={{ height: HEADER_LARGE_HEIGHT, marginBottom: 2 }} />
        <Drawer
          elevation={0}
          variant={isMediumScreen ? "permanent" : "temporary"}
          open={open}
          onClose={(e) => setDrawer(false)}
          PaperProps={{ style: { borderRight: 0 } }}
        >
          menu goes here
        </Drawer>
      </header>
      <Container
        maxWidth="sm"
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { sm: 0, md: `${DRAWER_WIDTH}px` } }}
      >
        {query ? <SearchResults search={query} /> : children}
      </Container>
      {!isMediumScreen && <Footer />}
    </>
  )
}

/** A shared layout for website pages */
export function SiteLayout({ children, title }: LayoutProps) {
  const pageTitle = title ? `${title} | ${TITLE}` : TITLE
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="sqlighter" />
      </Head>
      <Container maxWidth="sm">{children}</Container>
    </>
  )
}

//
// header.tsx
//

import * as React from "react"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Slide from "@mui/material/Slide"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

import { Avatar } from "../components/avatar"
import { Context } from "../components/context"

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export function Header(props) {
  const context = React.useContext(Context)

  return (
    <header>
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Container maxWidth="sm">
              <Typography variant="h6" component="div">
                <Avatar user={context.user} />
              </Typography>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </header>
  )
}

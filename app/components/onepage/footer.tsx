//
// footer.tsx
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import { Area } from "./area"
import { IconButton } from "../ui/iconbutton"

const Footer_SxProps: SxProps<Theme> = {
  paddingTop: 4,
  paddingBottom: 4,

  display: "flex",
  justifyContent: "center",
  alignItems: "top",

  ".IconButton-root": {
    width: 40,
    height: 40,
  },
  ".IconButton-root:hover": {
    color: "primary.main",
  },
  ".MuiLink-root:hover": {
    color: "primary.main",
  },
}

interface FooterProps {
  //
}

/** Page footer with usual links */
export function Footer(props: FooterProps) {
  return (
    <Area className="Footer-root">
      <Box sx={Footer_SxProps}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary", flexGrow: 1 }}>
          <IconButton
            edge="start"
            color="primary"
            command={{
              command: "openUrl",
              title: "Sqlighter",
              icon: "sqlighter",
              args: { href: "/" },
            }}
          />
          <Link href="/privacy" variant="body2" underline="none" color="inherit">
            Privacy Policy
          </Link>
          <Link href="/terms" variant="body2" underline="none" color="inherit">
            Terms of Service
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="top">
          <IconButton
            command={{
              command: "openUrl",
              title: "Github",
              icon: "github",
              args: { href: "https://github.com/sqlighter/sqlighter" },
            }}
          />
          <IconButton
            command={{
              command: "openUrl",
              title: "Twitter",
              icon: "twitter",
              args: { href: "https://twitter.com/sqlighter" },
            }}
          />
          <IconButton
            edge="end"
            command={{
              command: "openUrl",
              title: "Medium",
              icon: "medium",
              args: { href: "https://medium.com/sqlighter" },
            }}
          />
        </Stack>
      </Box>
    </Area>
  )
}

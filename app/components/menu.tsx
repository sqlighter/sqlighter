//
// menu.tsx - contents of left drawer (secondary navigation menu)
//

import { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import JournalIcon from "@mui/icons-material/AssignmentOutlined"
import LibraryIcon from "@mui/icons-material/LocalLibraryOutlined"
import ProfileIcon from "@mui/icons-material/PersonOutlineOutlined"
import LogoutIcon from "@mui/icons-material/LogoutOutlined"
import { Theme } from "@mui/material/styles"

import { Context } from "./context"
import { PRIMARY_LIGHTER, PRIMARY_LIGHTEST } from "./theme"
import { SigninButton } from "./signin"

const MENU_WIDTH = 280

function MenuLabel({ text, variant }: { text: string; variant?: "default" | "secondary" }) {
  if (variant == "secondary") {
    return (
      <Typography
        variant="body2"
        noWrap={true}
        color="text.secondary"
        sx={{ fontWeight: (theme: Theme) => theme.typography.fontWeightRegular }}
      >
        {text}
      </Typography>
    )
  }

  return (
    <Typography variant="body2" noWrap={true} sx={{ fontWeight: (theme: Theme) => theme.typography.fontWeightMedium }}>
      {text}
    </Typography>
  )
}

export function Menu({ onClose }) {
  const context = useContext(Context)
  const router = useRouter()
  const user = context.user

  function getMenuItem(title, icon, url) {
    const selected = router.pathname.startsWith(url)
    return (
      <Link href={url} passHref>
        <ListItemButton
          selected={selected}
          sx={{ marginLeft: -2, borderStartEndRadius: 48, borderEndEndRadius: 48 }}
          dense={true}
        >
          <ListItem alignItems="center">
            <ListItemIcon sx={{ marginLeft: 1 }}>{icon}</ListItemIcon>
            <ListItemText primary={<MenuLabel text={title} />} />
          </ListItem>
        </ListItemButton>
      </Link>
    )
  }

  const USERBOX_SX = {
    position: "absolute",
    width: "100%",
    bottom: 0,
    display: "flex",
    flexGrow: 1,
    paddingTop: 2,
    paddingBottom: 2,
  }

  function getUserItem() {
    if (!user) {
      return (
        <Box sx={USERBOX_SX} pl={3}>
          <SigninButton />
        </Box>
      )
    }

    const email = user?.id
    const displayName = user?.attributes?.passport?.displayName || ""
    const imageUrl = user?.attributes?.passport?.photos?.[0]?.value
    return (
      <Box sx={USERBOX_SX}>
        <Box ml={2} mr={3}>
          <Avatar alt={displayName} src={imageUrl} sx={{ height: 40, width: 40 }} />
        </Box>
        <Box flexGrow={1}>
          <MenuLabel text={displayName} />
          <MenuLabel text={email} variant="secondary" />
          <Box mt={1}>
            <Button
              size="small"
              onClick={(e) => context.signout("/library")}
              sx={{ position: "relative", left: "-4px" }}
            >
              Signout
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: MENU_WIDTH,
        height: "100%",
        // theme is extended in theme.tsx with very light shades used by material you specs
        background: (theme: Theme | any) =>
          `linear-gradient(to bottom, white 0%, white 40%, ${theme.palette.materialyou.primary.light} 100%)`,
      }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <Box
        height={128}
        display="flex"
        alignItems="flex-end"
        sx={{ position: "relative", backgroundColor: PRIMARY_LIGHTER, paddingLeft: 3, paddingBottom: 2 }}
      >
        <Image 
          src="/american-hearth-association.svg"
          alt="Biomarkers.app"
          width={100}
          height={100}
          layout="intrinsic"
          objectFit="contain"
          objectPosition="left bottom"
        />
      </Box>
      <Box sx={{ marginTop: 2, marginRight: 2 }}>
        <List dense disablePadding>
          {getMenuItem("Journal", <JournalIcon />, "/journal")}
          {getMenuItem("Library", <LibraryIcon />, "/library")}
          {getMenuItem("Profile", <ProfileIcon />, "/profile")}
        </List>
      </Box>
      {getUserItem()}
    </Box>
  )
}

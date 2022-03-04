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
import { SigninButton } from "./signin"

export function Menu({ width, onClose }) {
  const context = useContext(Context)
  const router = useRouter()
  const user = context.user

  function MenuLabel({ text, variant }: { text: string; variant?: "default" | "secondary" }) {
    if (variant == "secondary") {
      return (
        <Typography
          width={width - 100}
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
      <Typography
        width="180px"
        variant="body2"
        noWrap={true}
        sx={{ fontWeight: (theme: Theme) => theme.typography.fontWeightMedium }}
      >
        {text}
      </Typography>
    )
  }

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
    paddingRight: 2,
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
    const displayName = user?.passport?.displayName || ""
    const imageUrl = user?.passport?.photos?.[0]?.value
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
        width,
        height: "100%",
        // theme is extended in theme.tsx with very light shades used by material you specs
        background: (theme: Theme | any) =>
          `linear-gradient(to bottom, white 0%, white 40%, ${theme.palette.materialyou.primary.lightest} 100%)`,
      }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <Box
        height={128}
        display="flex"
        alignItems="flex-end"
        sx={{
          position: "relative",
          backgroundColor: (theme: Theme | any) => theme.palette.materialyou.primary.lightest,
          paddingLeft: 3,
          paddingBottom: 3,
        }}
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

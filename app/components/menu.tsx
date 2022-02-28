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

import { Context } from "./context"
import { PRIMARY_LIGHTER, PRIMARY_LIGHTEST } from "./theme"
import { SigninButton } from "./signin"

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
            <ListItemText primary={title} />
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
    backgroundColor: PRIMARY_LIGHTEST,
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
        <Box flexGrow={1} mb={2}>
          <Typography variant="body2" noWrap={true}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap={true}>
            {email}
          </Typography>
          <Box mt={2}>
            <Button variant="outlined" size="small" onClick={(e) => context.signout("/library")}>
              Sign Out
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: 300 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
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

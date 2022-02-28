//
// menu.tsx - contents of left drawer (secondary navigation menu)
//

import { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import Typography from "@mui/material/Typography"
import JournalIcon from "@mui/icons-material/AssignmentOutlined"
import LibraryIcon from "@mui/icons-material/LocalLibraryOutlined"
import ProfileIcon from "@mui/icons-material/PersonOutlineOutlined"

import { Context } from "./context"
import { Logo } from "./logo"

const LIST_ITEM_BUTTON_SX = { marginLeft: -2, borderStartEndRadius: 48, borderEndEndRadius: 48 }

export function Menu({ onClose }) {
  const context = useContext(Context)
  const router = useRouter()
  const user = context.user

  function getMenuItem(title, icon, url) {
    const selected = router.pathname.startsWith(url)
    return (
      <Link href={url} passHref>
        <ListItemButton selected={selected} sx={LIST_ITEM_BUTTON_SX} dense={true}>
          <ListItem alignItems="center">
            <Box sx={{ marginLeft: 1, marginRight: 3 }}>{icon}</Box>
            <ListItemText primary={title} />
          </ListItem>
        </ListItemButton>
      </Link>
    )
  }

  function getUserItem() {
    const email = user?.id
    const displayName = user?.attributes?.passport?.displayName || ""
    const imageUrl = user?.attributes?.passport?.photos?.[0]?.value
    return (
      <Box sx={{ position: "absolute", bottom: 0, display: "flex", width: "100%", flexGrow: 1 }} mr={2}>
        <Box ml={2} mr={2}>
          <Avatar alt={displayName} src={imageUrl} sx={{ height: 40, width: 40 }} />
        </Box>
        <Box flexGrow={1} mb={2}>
          <Typography variant="body2">{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
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
      <Box height={128} display="flex" sx={{ position: "relative" }}>
        <Box ml={2} alignSelf="flex-end">
          <Logo organizationId="american-hearth-association" width={120} height={120} />
        </Box>
      </Box>

      <Box mt={2} mr={2}>
        <List dense disablePadding>
          {getMenuItem("Journal", <JournalIcon />, "/journal")}
          {getMenuItem("Library", <LibraryIcon />, "/library")}
          {getMenuItem("Profile", <ProfileIcon />, "/profile")}
        </List>
      </Box>

      {user && getUserItem()}
    </Box>
  )
}

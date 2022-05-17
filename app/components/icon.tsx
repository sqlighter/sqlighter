//
// icon.tsx - an icon component that imports only the icons we need to we keep our bundle size down
//

import { LibraryMusicOutlined } from "@mui/icons-material"
import MuiIcon from "@mui/material/Icon"

import JournalIcon from "@mui/icons-material/AssignmentOutlined"
import LibraryIcon from "@mui/icons-material/LocalLibraryOutlined"
import ProfileIcon from "@mui/icons-material/PersonOutlineOutlined"
import DatabaseIcon from '@mui/icons-material/Storage';

interface IconProps {
  color
  fontSize
  htmlColor
  sx
  titleAccess
}

export function getIcon(name: string, fontSize?) {
  name = name.toLowerCase()
  if (name.startsWith("icon://")) {
    name = name.substring("icon://".length)
  }
  console.debug(`icon - name: ${name}`)
  return <MuiIcon>{name}</MuiIcon>

  switch (name) {
    case "journal":
      return <JournalIcon fontSize={fontSize} />
    case "library":
      return <LibraryMusicOutlined fontSize={fontSize} />
    case "profile":
      return <ProfileIcon fontSize={fontSize} />
  }
  console.warn("getIcon('%s') - icon is missing in bundle, please add to /components/icon.tsx", name)
  return null
}

export function Icon({ children, fontSize }) {
  return getIcon(children as string, fontSize)
}

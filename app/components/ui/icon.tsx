//
// icon.tsx - svg based icon from an icon's name, eg: <Icon>database</Icon>
//

import * as React from "react"
import { SvgIconProps } from "@mui/material"

// Material Icons (Google)
// https://mui.com/material-ui/material-icons/?query=table&theme=Outlined
// https://fonts.google.com/icons
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import BentoOutlinedIcon from "@mui/icons-material/BentoOutlined"
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined"
import DatabaseIcon from "@mui/icons-material/StorageOutlined"
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined"
import FolderIcon from "@mui/icons-material/FolderOutlined"
import HistoryIcon from "@mui/icons-material/HistoryOutlined"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import KeyIcon from "@mui/icons-material/KeyOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined"
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined"
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined"
import QuestionMarkIcon from "@mui/icons-material/QuestionMarkOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import SettingsOutlined from "@mui/icons-material/SettingsOutlined"
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined"
import TableIcon from "@mui/icons-material/TableChartOutlined"

// Material Design Icons (open source)
// https://materialdesignicons.com/
// https://github.com/TeamWertarbyte/mdi-material-ui
// https://pictogrammers.github.io/@mdi/font/6.5.95/
import { DatabaseOutline } from "mdi-material-ui"

// Font Awesome
// https://fontawesome.com/icons/server?s=regular

export interface IconProps extends SvgIconProps {
  children: string | React.ReactNode
}

export function Icon(props: IconProps) {
  if (typeof props.children !== "string") {
    // if an icon element was passed directly this is just a passthrough component
    return <>{props.children}</>
  }

  switch (props.children) {
    case "account":
      return <AccountCircleOutlined {...props} />
    case "add":
      return <AddOutlinedIcon {...props} />
    case "database":
      return <DatabaseOutline {...props} />
    case "file":
      return <FileIcon {...props} />
    case "folder":
      return <FolderIcon {...props} />
    case "history":
      return <HistoryIcon {...props} />
    case "info":
      return <InfoOutlinedIcon {...props} />
    case "key":
      return <KeyIcon {...props} />
    case "more":
      return <MoreHorizOutlinedIcon {...props} />
    case "pin":
    case "pinned":
      return <PushPinOutlinedIcon {...props} sx={{ transform: "rotate(45deg)" }} />
    case "play":
      return <PlayArrowOutlinedIcon {...props} />
    case "print":
      return <PrintOutlinedIcon {...props} />
    case "query":
      return <TableRowsOutlinedIcon {...props} />
    case "refresh":
      return <RefreshOutlinedIcon {...props} />
    case "settings":
      return <SettingsOutlined {...props} />
    case "share":
      return <ShareOutlinedIcon {...props} />
    case "tabsRight":
      return <BentoOutlinedIcon {...props} />
    case "tabsBottom":
      return <BentoOutlinedIcon {...props} sx={{ transform: "rotate(90deg)" }} />
    case "trigger":
      return <BoltOutlinedIcon {...props} />
    case "table":
    case "view":
      return <TableIcon {...props} />

    default:
      return <QuestionMarkIcon {...props} />
  }
}

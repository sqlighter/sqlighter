//
// icon.tsx - svg based icon from an icon's name, eg: <Icon>database</Icon>
//

import React from "react"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import { SvgIconProps } from "@mui/material"

// Material Icons (Google)
// https://mui.com/material-ui/material-icons/?query=table&theme=Outlined
// https://fonts.google.com/icons
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import AlignHorizontalLeftOutlinedIcon from "@mui/icons-material/AlignHorizontalLeftOutlined"
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined"
import BentoOutlinedIcon from "@mui/icons-material/BentoOutlined"
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined"
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined"
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined"
import BungalowOutlinedIcon from "@mui/icons-material/BungalowOutlined"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined"
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined"
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined"
import FolderIcon from "@mui/icons-material/FolderOutlined"
import HistoryIcon from "@mui/icons-material/HistoryOutlined"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined"
import KeyIcon from "@mui/icons-material/KeyOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined"
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined"
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined"
import QuestionMarkIcon from "@mui/icons-material/QuestionMarkOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import SettingsOutlined from "@mui/icons-material/SettingsOutlined"
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined"
import TableIcon from "@mui/icons-material/TableChartOutlined"
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined"

// Material Design Icons (open source)
// https://materialdesignicons.com/
// https://github.com/TeamWertarbyte/mdi-material-ui
// https://pictogrammers.github.io/@mdi/font/6.5.95/
import { DatabaseOutline } from "mdi-material-ui"
import { DatabaseExportOutline } from "mdi-material-ui"
import { ArrowExpand } from "mdi-material-ui"
import { ImageText } from "mdi-material-ui"

// Custom svg icon files in /icons
import { SqliteIcon } from "./icons/sqliteicon"
import { FireIcon } from "./icons/fireicon"

// Font Awesome
// https://fontawesome.com/icons/server?s=regular

// IconScout
// https://iconscout.com/unicons/explore/line

/** Display a dot badge with the given color (default none) */
export type DotColor = "default" | "success" | "primary" | "secondary" | "error" | "info" | "warning"

export interface IconProps extends SvgIconProps {
  /** Display a dot badge with the given color (default none) */
  dotColor?: DotColor

  /** Normally the content is a string with the icon's name but it could be an icon itself or other element */
  children: string | React.ReactNode
}

/** An svg icon from its name */
export function Icon(props: IconProps) {
  function getIcon(name) {
    switch (name) {
      case "account":
        return <AccountCircleOutlined {...props} />
      case "add":
        return <AddOutlinedIcon {...props} />
      case "bookmark":
        return <BookmarkBorderOutlinedIcon {...props} />
      case "bookmarks":
        return <BookmarksOutlinedIcon {...props} />
      case "close":
        return <CloseOutlinedIcon {...props} />
      case "chart":
        // return <BarChartOutlinedIcon {...props} />
        return <InsertChartOutlinedIcon {...props} />
      case "database":
        return <DatabaseOutline {...props} />
      case "description":
        return <ImageText {...props} />
      case "download":
        return <CloudDownloadOutlinedIcon {...props} />
      case "dragHorizontal":
        return <DragHandleIcon {...props} />
      case "dragVertical":
        return <DragHandleIcon {...props} sx={{ transform: "rotate(90deg)" }} />
      case "edit":
        return <EditOutlinedIcon {...props} />
      case "expand":
        return <ExpandMoreOutlinedIcon {...props} />
      case "export":
        return <FileDownloadOutlinedIcon {...props} />
      case "extension":
        return <ExtensionOutlinedIcon {...props} />
      case "file":
        return <FileIcon {...props} />
      case "filter":
        return <FilterAltOutlinedIcon {...props} />
      case "fire":
        return <FireIcon {...props} />
      case "folder":
        return <FolderIcon {...props} />
      case "format":
        return <AlignHorizontalLeftOutlinedIcon {...props} />
      case "fullscreen":
        // return <FullscreenOutlinedIcon {...props} />
        return <ArrowExpand {...props} />
      case "home":
        // return <BungalowOutlinedIcon {...props} />
        return <HomeOutlinedIcon {...props} />
      case "history":
        return <HistoryIcon {...props} />
      case "inbox":
        return <InboxOutlinedIcon {...props} />
      case "info":
        return <InfoOutlinedIcon {...props} />
      case "key":
        return <KeyIcon {...props} />
      case "more":
        return <MoreHorizOutlinedIcon {...props} />
      case "pin":
        return <PushPinOutlinedIcon {...props} />
      case "play":
        return <PlayArrowOutlinedIcon {...props} />
      case "print":
        return <PrintOutlinedIcon {...props} />
      case "query":
        return <TableRowsOutlinedIcon {...props} />
      case "refresh":
        return <RefreshOutlinedIcon {...props} />
      case "search":
        return <SearchOutlinedIcon {...props} />
      case "settings":
        return <SettingsOutlined {...props} />
      case "share":
        return <ShareOutlinedIcon {...props} />
      case "sqlite":
      case "sqlite3":
        return <SqliteIcon {...props} />
      case "tabsRight":
        return <BentoOutlinedIcon {...props} />
      case "tabsBottom":
        return <BentoOutlinedIcon {...props} sx={{ transform: "rotate(90deg)" }} />
      case "trigger":
        return <BoltOutlinedIcon {...props} />
      case "table":
        return <TableIcon {...props} />
      case "view":
        return <TableIcon {...props} />
      case "unpin":
        return <PushPinOutlinedIcon {...props} sx={{ transform: "rotate(45deg)" }} />
      case "upload":
        return <CloudUploadOutlinedIcon {...props} />
      case "whatshot":
        return <WhatshotOutlinedIcon {...props} />

      default:
        return <QuestionMarkIcon {...props} />
    }
  }

  let icon = typeof props.children !== "string" ? <>{props.children}</> : getIcon(props.children)

  if (props.dotColor) {
    icon = (
      <Box>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color={props.dotColor}
        >
          {icon}
        </Badge>
      </Box>
    )
  }

  return icon
}

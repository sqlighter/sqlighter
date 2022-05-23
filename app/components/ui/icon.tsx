//
// icon.tsx - svg based icon from an icon's name, eg: <Icon>database</Icon>
//

import * as React from "react"
import { SvgIconProps } from "@mui/material"

// Material Icons (Google)
// https://mui.com/material-ui/material-icons/?query=table&theme=Outlined
// https://fonts.google.com/icons
import DatabaseIcon from "@mui/icons-material/StorageOutlined"
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined"
import FolderIcon from "@mui/icons-material/FolderOutlined"
import TableIcon from "@mui/icons-material/TableChartOutlined"
import KeyIcon from "@mui/icons-material/KeyOutlined"
import QuestionMarkIcon from "@mui/icons-material/QuestionMarkOutlined"
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined"
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined"
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"

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
  if (typeof props.children === "string") {
    switch (props.children) {
      case "database":
        return <DatabaseOutline {...props} />
      case "file":
        return <FileIcon {...props} />
      case "folder":
        return <FolderIcon {...props} />
      case "info":
        return <InfoOutlinedIcon {...props} />
      case "key":
        return <KeyIcon {...props} />
      case "more":
        return <MoreHorizOutlinedIcon {...props} />
      case "pin":
        return <StarBorderOutlinedIcon {...props} />
      case "query":
        return <TableRowsOutlinedIcon {...props} />
      case "refresh":
        return <RefreshOutlinedIcon {...props} />
      case "trigger":
        return <BoltOutlinedIcon {...props} />
      case "table":
      case "view":
        return <TableIcon {...props} />
    }
    return <QuestionMarkIcon {...props} />
  }

  // if an icon element was passed directly this is just a passthrough
  return <>{props.children}</>
}
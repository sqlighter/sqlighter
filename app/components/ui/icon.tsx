//
// icon.tsx - svg based icon from an icon's name, eg: <Icon>database</Icon>
//

import * as React from "react"
import { SvgIconProps } from "@mui/material"

// for now we import icons one by one to try keeping bundle size down
// https://materialdesignicons.com/
// https://fontawesome.com/icons/server?s=regular
// https://pictogrammers.github.io/@mdi/font/6.5.95/

import DatabaseIcon from "@mui/icons-material/StorageOutlined"
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined"
import FolderIcon from "@mui/icons-material/FolderOutlined"
import TableIcon from "@mui/icons-material/TableChartOutlined"
import QuestionMarkIcon from "@mui/icons-material/QuestionMarkOutlined"

export interface IconProps extends SvgIconProps {
  children: string | React.ReactNode
}

export function Icon(props: IconProps) {
  if (typeof props.children === "string") {
    switch (props.children) {
      case "database":
        return <DatabaseIcon {...props} />
      case "file":
        return <FileIcon {...props} />
      case "folder":
        return <FolderIcon {...props} />
      case "table":
        return <TableIcon {...props} />
    }
    return <QuestionMarkIcon {...props} />
  }

  // if an icon element was passed directly this is just a passthrough
  return <>{props.children}</>
}

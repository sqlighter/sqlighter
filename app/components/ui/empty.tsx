//
// empty.tsx - shows an empty state with image, title, description and an optional action item like a signin button
//

import Image from "next/image"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { alpha, SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"

import { FANCY_RADIUS } from "../listitems"
import { Icon } from "./icon"

const Empty_SxProps: SxProps<Theme> = {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 4,

  ".Empty-imageBox": {
    width: 160,
    height: 160,
    mb: 2,
    overflow: "hidden",
    position: "relative",
    borderRadius: "50%",

    backgroundColor: "rgba(0,0,0,.01)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".Empty-iconBox": {
    width: 160,
    height: 160,
    mb: 2,

    borderRadius: "50%",
    backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.02),
    // light background with tint from the primary color in the theme
    // backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".Empty-icon": {
    fontSize: 100,
    color: (theme) => alpha(theme.palette.text.primary, 0.09),
    // light background with tint from the primary color in the theme
    // color: (theme) => alpha(theme.palette.primary.main, 0.09),
},

  ".Empty-fancyBox": {
    borderRadius: FANCY_RADIUS,
  },
}

export interface EmptyProps {
  /** Large image shown as round avatar, centered */
  image?: any

  /** Icon (optional, in alternative to image) */
  icon?: string

  /** Empty state title, eg. No documents */
  title?: string

  /** Empty state description (optional) */
  description?: string

  /** Optional action item below empty state, for example a <SigninButton /> */
  action?: any

  /** Round image, or fancy shape (default centered) */
  variant?: "round" | "fancy"

  /** Margin top, default: 4 */
  sx?: SxProps<Theme>
}

export function Empty(props: EmptyProps) {
  const variant = props.variant || "round"
  return (
    <Stack className="Empty-root" sx={Empty_SxProps}>
      {props.image && (
        <Box className={`Empty-imageBox Empty-${variant}Box`}>
          <Image src={props.image} layout="fill" objectFit="cover" unoptimized />
        </Box>
      )}
      {props.icon && (
        <Box className={`Empty-iconBox Empty-${variant}Box`}>
          <Icon className="Empty-icon">{props.icon}</Icon>
        </Box>
      )}
      {props.title && (
        <Typography variant="subtitle1" color="text.primary" noWrap={true}>
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography variant="caption" color="text.secondary">
          {props.description}
        </Typography>
      )}
      {props.action && <Box mt={2}>{props.action}</Box>}
    </Stack>
  )
}

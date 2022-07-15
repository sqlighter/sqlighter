//
// empty.tsx - shows an empty state with image, title, description and an optional action item like a signin button
//

import { ReactElement } from "react"
import Image from "next/image"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { alpha, SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"

import { Icon } from "./icon"
import { FANCY_RADIUS } from "../theme"

const Empty_SxProps: SxProps<Theme> = {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 4,

  ".Empty-imageBox": {
    width: 140,
    height: 140,
    marginBottom: 2,
    overflow: "hidden",
    position: "relative",
    borderRadius: "50%",

    backgroundColor: "rgba(0,0,0,.01)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".Empty-iconBox": {
    width: 140,
    height: 140,
    marginBottom: 2,
 
    borderRadius: "50%",
    // backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.05),
    // light background with tint from the primary color in the theme
    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".Empty-icon": {
    fontSize: 100,
    color: "background.paper",
    // light background with tint from the primary color in the theme
    // color: (theme) => alpha(theme.palette.primary.main, 0.09),
  },

  ".Empty-fancyBox": {
    borderRadius: FANCY_RADIUS,
  },

  ".Empty-title": {
    maxWidth: 180,
    textAlign: "center",
  },

  ".Empty-description": {
    maxWidth: 180,
    textAlign: "center",
  },

  ".Empty-children": {
    //
  }
}

export interface EmptyProps {
  /** Class to be applied to this component */
  className?: string
  /** Large image shown as round avatar, centered */
  image?: any
  /** Icon (optional, in alternative to image) */
  icon?: React.ReactNode | string
  /** Empty state title, eg. No documents */
  title?: string
  /** Empty state description (optional) */
  description?: string
  /** Round image, or fancy shape (default centered) */
  variant?: "round" | "fancy"
  /** Margin top, default: 4 */
  sx?: SxProps<Theme>
  /** Optional action item below empty state, for example a <SigninButton /> */
  children?: ReactElement
}

/** An empty state placeholder with a visual + message (eg. no messages in your inbox) */
export function Empty(props: EmptyProps) {
  const variant = props.variant || "round"

  // NOTE image is "unoptimized" to avoid issues with next.js in storybook
  let className = "Empty-root" + (props.className ? " " + props.className : "")

  return (
    <Stack className={className} sx={Empty_SxProps}>
      {props.image && (
        <Box className={`Empty-imageBox Empty-${variant}Box`}>
          <Image src={props.image} layout="fill" objectFit="cover" unoptimized />
        </Box>
      )}
      {!props.image && props.icon && (
        <Box className={`Empty-iconBox Empty-${variant}Box`}>
          <Icon className="Empty-icon">{props.icon}</Icon>
        </Box>
      )}
      {props.title && (
        <Typography className="Empty-title" variant="subtitle1" color="text.primary" noWrap={true}>
          {props.title}
        </Typography>
      )}
      {props.description && (
        <Typography className="Empty-description" variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      )}
      {props.children && <Box className="Empty-children">{props.children}</Box>}
    </Stack>
  )
}

/** An empty state for missing features */
export function MissingFeature(props: EmptyProps) {
  return (
    <Empty
      {...props}
      image="/images/work-in-progress.webp"
      title="Not quite there"
      description="We're still working on this feature..."
      variant="fancy"
    />
  )
}

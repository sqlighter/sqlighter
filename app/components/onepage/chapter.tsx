//
// chapter.tsx - a block with an icon, title, description, action + image
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { useWideScreen } from "../hooks/usewidescreen"
import { Spacer } from "./spacer"

const Chapter_Center_SxProps = (props: ChapterProps): SxProps<Theme> => {
  return {
    ".Chapter-container": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    ".Chapter-title": {
      marginTop: 2,
      fontWeight: "bold",
      textAlign: "center",
    },

    ".Chapter-description": {
      textAlign: "center",
    },
    ".Chapter-text": {
      marginTop: 4,
      textAlign: "center",
      maxWidth: 720,
    },

    ".Chapter-buttons": {
      marginTop: 4,
    },

    ".Chapter-image": {
      height: 182,
      width: 1,
      maxWidth: 1,

      backgroundImage: props.image ? `url("${props.image}")` : undefined,
      backgroundPosition: "center bottom",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
    },
  }
}

const Chapter_Left_SxProps = (props: ChapterProps): SxProps<Theme> => {
  return {
    ".Chapter-container": {
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      justifyContent: "middle",
    },

    ".Chapter-contents": {
      paddingRight: 4,
    },

    ".Chapter-title": {
      marginTop: 2,
      fontWeight: "bold",
    },
    ".Chapter-description": {
      marginTop: 2,
    },
    ".Chapter-text": {
      marginTop: 4,
    },

    ".Chapter-buttons": {
      marginTop: 4,
    },

    ".Chapter-image": {
      height: 360,
      maxHeight: 480,
      width: 1,

      backgroundImage: props.image ? `url("${props.image}")` : undefined,
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
    },
  }
}

interface ChapterProps {
  /** Classname applied to component and subcomponents */
  className?: string
  /** Icon, defaults to logo */
  icon?: string | any
  /** Title for section */
  title: any
  /** Description for section */
  description: any
  /** Further descriptive text (optional) */
  text?: string
  /** Image shown at bottom of panel, should develop horizontally (optional) */
  image?: string
  /** Buttons */
  buttons?: any
  /** Layout variant, default "center" */
  variant?: "center" | "left"
  /** Title size, use large for hero chapter */
  size?: "default" | "large"
}

/** A block with an icon, title, description, action + image */
export function Chapter(props: ChapterProps) {
  //
  // state
  //

  const [isWideScreen] = useWideScreen()

  const variant = props.variant || "center"
  const size = props.size || "default"
  let className = `Chapter-root Chapter-${variant}`
  if (props.size === "large") {
    className += " Chapter-large"
  }
  if (props.className) {
    className += " " + props.className
  }

  // title fontSize based on "hero" and desktop/mobile
  let titleVariant: "h2" | "h3" | "h4" | "h5" = size == "large" ? "h3" : "h5"
  if (isWideScreen) {
    titleVariant = size == "large" ? "h2" : "h4"
  }

  //
  // render
  //

  function renderCenter() {
    let icon = props.icon
    if (typeof icon === "string") {
      icon = <img src={props.icon} alt={props.title} />
    }

    return (
      <Box className={className} sx={Chapter_Center_SxProps(props)}>
        <Container className="Chapter-container" maxWidth="lg">
          <Spacer />
          {props.icon && <Box className="Chapter-icon">{icon}</Box>}
          <Typography className="Chapter-title" variant={titleVariant} color="text.primary">
            {props.title}
          </Typography>
          <Typography className="Chapter-description" variant="h6" color="text.secondary">
            {props.description}
          </Typography>
          {props.text && (
            <Typography className="Chapter-text" variant="body1" color="text.secondary">
              {props.text}
            </Typography>
          )}
          {props.buttons && (
            <Stack className="Chapter-buttons" direction="row" spacing={2}>
              {props.buttons}
            </Stack>
          )}
        </Container>
        {props.image ? <Box className="Chapter-image" /> : <Spacer />}
      </Box>
    )
  }

  function renderLeft() {
    let icon = props.icon || "/branding/logo.png"
    if (typeof icon === "string") {
      icon = <img src={props.icon} alt={props.title} />
    }

    return (
      <Box className={className} sx={Chapter_Left_SxProps(props)}>
        <Container className="Chapter-container" maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid className="Chapter-contents" item xs={12} md={6}>
              <Spacer />
              {props.icon && <Box className="Chapter-icon">{icon}</Box>}
              <Typography className="Chapter-title" variant={titleVariant} color="text.primary">
                {props.title}
              </Typography>
              <Typography className="Chapter-description" variant="h6" color="text.secondary">
                {props.description}
              </Typography>
              {props.text && (
                <Typography className="Chapter-text" variant="body1" color="text.secondary">
                  {props.text}
                </Typography>
              )}
              {props.buttons && (
                <Stack className="Chapter-buttons" direction={variant == "left" ? "row" : "column"} spacing={2}>
                  {props.buttons}
                </Stack>
              )}
              <Spacer />
            </Grid>
            <Grid className="Chapter-image" item xs={12} md={6} />
          </Grid>
        </Container>
        {isWideScreen && <Spacer />}
      </Box>
    )
  }

  return variant == "left" ? renderLeft() : renderCenter()
}

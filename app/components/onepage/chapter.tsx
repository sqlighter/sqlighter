//
// chapter.tsx - a block with an icon, title, description, action + image
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { Spacer } from "./spacer"

const ChapterCentered_SxProps: SxProps<Theme> = {
  ".Chapter-container": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  ".Chapter-title": {
    marginTop: 2,
    fontWeight: 500,
    textAlign: "center",
  },

  ".Chapter-description": {
    marginTop: 2,
    textAlign: "center",
  },

  ".Chapter-image": {
    height: 240,
    maxWidth: 1,
    marginTop: 2,
    img: {
      height: 240,
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
}

interface ChapterProps {
  /** Classname applied to component and subcomponents */
  className?: string
  /** Icon, defaults to logo */
  icon?: any
  /** Title for section */
  title: any
  /** Description for section */
  description: any
  /** Image shown at bottom of panel, should develop horizontally */
  image: string
  /** Buttons */
  buttons?: any
  /** Layout variant, default "centered" */
  variant?: "centered"
}

/** A block with an icon, title, description, action + image */
export function Chapter(props: ChapterProps) {
  const className = "Chapter-root" + (props.className ? " " + props.className : "")

  function renderCentered() {
    return (
      <Box className={className} sx={ChapterCentered_SxProps}>
        <Spacer />
        <Container className="Chapter-container" maxWidth="lg">
          <Box className="Chapter-icon">
            <img src={props.icon || "/branding/logo.png"} alt={props.title} />
          </Box>
          <Typography className="Chapter-title" variant="h4" color="text.primary">
            {props.title}
          </Typography>
          <Typography className="Chapter-description" variant="h5" color="text.secondary">
            {props.description}
          </Typography>
          {props.buttons && <Box className="Chapter-buttons">{props.buttons}</Box>}
        </Container>
        <Box className="Chapter-image">
          <img src={props.image} alt={props.title} />
        </Box>
      </Box>
    )
  }

  switch (props.variant) {
    case "centered":
    default:
      return renderCentered()
  }
}

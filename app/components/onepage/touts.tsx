//
// touts.tsx - area three features with icon, title, description
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

import { Icon } from "../ui/icon"
import { Spacer } from "./spacer" 

const Touts_SxProps: SxProps<Theme> = {
  ".Touts-item": {
    maxWidth: 320,
    marginLeft: 0,
    marginRight: "auto",
  },

  ".Touts-icon": {
    width: 48,
    height: 48,

    color: "white",
    backgroundColor: "primary.main",
    borderRadius: "50%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".Touts-title": {
    marginTop: 2,
    fontWeight: "bold",
  },
  ".Touts-description": {
    marginTop: 1
  }
}

interface ToutsProps {
  /** Classname applied to component and subcomponents */
  className?: string
  /** Contents of features shown */
  features: { title: string; description: string; icon: string }[]
}

/** Show a set of three features with icon, title, description */
export function Touts(props: ToutsProps) {
  const className = "Touts-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} sx={Touts_SxProps}>
      <Spacer />
      <Grid container spacing={4}>
        {props.features.map((feature, index) => (
          <Grid key={index} item xs={12} md={4}>
            <Box className="Touts-item">
              <Box className="Touts-icon">
                <Icon fontSize="medium">{feature.icon}</Icon>
              </Box>
              <Typography className="Touts-title" variant="h6" color="text.primary">
                {feature.title}
              </Typography>
              <Typography className="Touts-description" variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Spacer />
    </Box>
  )
}

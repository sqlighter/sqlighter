//
// empty.tsx - shows an empty state with image, title, description and an optional action item like a signin button
//

import Image from "next/image"
import Badge from "@mui/material/Badge"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"

import { FANCY_RADIUS } from "./listitems"

interface EmptyProps {
  /** Large image shown as round avatar, centered */
  image: any

  /** Empty state title, eg. No documents */
  title?: string

  /** Empty state description (optional) */
  description?: string

  /** Optional action item below empty state, for example a <SigninButton /> */
  action?: any

  /** Round image, or fancy shape */
  variant?: "round" | "fancy"

  /** Margin top, default: 4 */
  sx?: SxProps<Theme>
}

export function Empty({ image, title, description, action, sx, variant }: EmptyProps) {
  return (
    <Stack alignItems="center" justifyContent="center" mt={4} sx={sx}>
      <Box
        width={240}
        height={240}
        mb={2}
        sx={{
          borderRadius: variant == "fancy" ? FANCY_RADIUS : "50%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image src={image} layout="fill" objectFit="cover" />
      </Box>
      {title && (
        <Typography variant="h3" color="text.primary" noWrap={true}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {action && <Box mt={2}>{action}</Box>}
    </Stack>
  )
}

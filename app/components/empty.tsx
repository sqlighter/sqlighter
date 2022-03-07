//
// empty.tsx - shows an empty state with image, title, description and an optional action item like a signin button
//

import Image from "next/image"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"

interface EmptyProps {
  /** Large image shown as round avatar, centered */
  image: any

  /** Empty state title, eg. No documents */
  title?: string

  /** Empty state description (optional) */
  description?: string

  /** Optional action item below empty state, for example a <SigninButton /> */
  action?: any

  /** Margin top, default: 4 */
  sx?: SxProps<Theme>
}

export function Empty({ image, title, description, action, sx }: EmptyProps) {
  return (
    <Stack alignItems="center" justifyContent="center" mt={4} sx={sx}>
      <Box width={240} height={240} sx={{ borderRadius: "50%", position: "relative" }} mb={2}>
        <Image src={image} layout="fill" objectFit="cover" className="round" />
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

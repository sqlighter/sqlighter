//
// biomarkerlistitem.tsx - a biomarker entry in a list of biomarkers
//

import Link from "next/link"
import Image from "next/image"

import Box from "@mui/material/Box"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { Logo } from "./logo"

function getImage(src, alt, width, height, className?) {
  if (src) {
    if (src.startsWith("/")) {
      return <Image src={src} alt={alt} width={width} height={height} className={className} />
    }
    return (
      <img src={src} alt={alt} width={width} height={height} style={{ objectFit: "cover" }} className={className} />
    )
  }

  return <Box width={width} height={height} />
}

export interface ReferenceListItemProps {
  reference: any
}

export function ReferenceListItem({ reference }: ReferenceListItemProps) {
  console.assert(reference.url)
  const hostname = new URL(reference.url).hostname

  // TODO we could make the text of list items a bit bigger in the theme itself
  let primary = (
    <Typography variant="body1" noWrap={true}>
      {reference.title}
    </Typography>
  )

  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>
  //const primary = biomarker.title
  const secondary = hostname

  return (
    <Link href={reference.url} passHref>
      <Box display="flex" alignItems="flex-start" mb={2}>
        <Box mr={2}>{getImage(reference.imageUrl, reference.title, 64, 64, "rounded")}</Box>
        <Stack flexGrow={1}>
          <Typography variant="h6" lineHeight={1} color="text.primary">
            {reference.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {secondary} · 3 min read
          </Typography>
          {reference.organizationId && (
            <Box mt={0.5}>
              <Logo organizationId={reference.organizationId} height={20} width={60} objectPosition="left center" />
            </Box>
          )}
        </Stack>
      </Box>
    </Link>
  )
}

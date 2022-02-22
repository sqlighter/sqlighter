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

export interface ListItemProps {
  item: any
}

export function ReferenceListItem({ item }: ListItemProps) {
  console.assert(item.url)
  const hostname = new URL(item.url).hostname

  // TODO we could make the text of list items a bit bigger in the theme itself
  let primary = (
    <Typography variant="body1" noWrap={true}>
      {item.title}
    </Typography>
  )

  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>
  //const primary = biomarker.title
  const secondary = hostname

  return (
    <Link href={item.url} passHref>
      <Box display="flex" alignItems="flex-start" mb={2}>
        <Box mr={2}>{getImage(item.imageUrl, item.title, 64, 64, "rounded")}</Box>
        <Stack flexGrow={1}>
          <Typography variant="h6" lineHeight={1} color="text.primary">
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {secondary} · 3 min read
          </Typography>
          {item.organizationId && (
            <Box mt={0.5}>
              <Logo organizationId={item.organizationId} height={20} width={60} objectPosition="left center" />
            </Box>
          )}
        </Stack>
      </Box>
    </Link>
  )
}



export function BiomarkerListItem({ item }: ListItemProps) {
  // TODO biomarker itself could have an image url or a group of biomarkers could give it one
  const biomarkerImageUrl = "/biomarkers/blood.jpeg"

  // TODO we could make the text of list items a bit bigger in the theme itself
  const primary = (
    <Typography variant="body1" noWrap={true}>
      {item.title}
    </Typography>
  )
  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>
  //const primary = biomarker.title
  const secondary = item.description

  return (
    <Link href={`/biomarkers/${item.id}`} key={item.id} passHref>
      <ListItemButton sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }} dense={true}>
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <ListItemAvatar>
            <Image src={biomarkerImageUrl} alt={item.title} width={40} height={40} className="rounded" />
          </ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

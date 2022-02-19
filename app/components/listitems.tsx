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
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} width={width} height={height} className={className} />
  }

  return <img src={src} alt={alt} width={width} height={height} className={className} />
}

export interface ReferenceListItemProps {
  reference: any
}

/*
key={ref.url}
title={ref.title}
url={ref.url}
imageUrl={ref.imageUrl}
videoUrl={ref.videoUrl}
organizationId={ref.organizationId}
*/

export function ReferenceListItem({ reference }: ReferenceListItemProps) {
  console.assert(reference.url)
  const hostname = new URL(reference.url).hostname

  // TODO we could make the text of list items a bit bigger in the theme itself
  const primary = (
    <Typography variant="body1" noWrap={true}>
      {reference.title}
    </Typography>
  )

  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>
  //const primary = biomarker.title
  const secondary = hostname

  return (
    <Link href={reference.url} passHref>
      <ListItemButton sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }} dense={true}>
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <ListItemAvatar>{getImage(reference.imageUrl, reference.title, 40, 40, "rounded")} </ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
          <Box>
            <Logo organizationId={reference.organizationId} height={14} width={96} />
          </Box>
        </ListItem>
      </ListItemButton>
    </Link>
  )
/*
  return (
    <Link href={props.url} passHref>
      <ListItemButton
        sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }}
        dense={true}
        className="article-listitem"
      >
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: 0, marginBottom: 0 }}>
          <Box display="flex" flexGrow={1}>
            <Box mr={2}>
              <img src={props.imageUrl} alt={props.title} className="article-thumbnail" />
            </Box>
            <Stack sx={{ flexGrow: 1 }}>
              {props.organizationId && (
                <Box mb={1}>
                  <Logo organizationId={props.organizationId} height={14} width={96} />
                </Box>
              )}
              <Typography variant="body1" color="text.primary" mb={0}>
                {props.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hostname}
              </Typography>
            </Stack>
          </Box>
        </ListItem>
      </ListItemButton>
    </Link>
  )
  */
}

export function ArticleListItemOLD(props: any) {
  console.assert(props.url)

  const hostname = new URL(props.url).hostname

  return (
    <Link href={props.url} passHref>
      <ListItemButton
        sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }}
        dense={true}
        className="article-listitem"
      >
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: 0, marginBottom: 0 }}>
          <Box display="flex" flexGrow={1}>
            <Box mr={2}>
              <img src={props.imageUrl} alt={props.title} className="article-thumbnail" />
            </Box>
            <Stack sx={{ flexGrow: 1 }}>
              {props.organizationId && (
                <Box mb={1}>
                  <Logo organizationId={props.organizationId} height={14} width={96} />
                </Box>
              )}
              <Typography variant="body1" color="text.primary" mb={0}>
                {props.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hostname}
              </Typography>
            </Stack>
          </Box>
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

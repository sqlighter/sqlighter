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

export interface ArticleListItemProps {
  title?: string
  subtitle?: string

  url: string
  imageUrl?: string
  videoUrl?: string

  organizationId?: string
}

export function ArticleListItem(props: ArticleListItemProps) {
  console.assert(props.url)

  const hostname = new URL(props.url).hostname

  return (
    <Link href={props.url} passHref>
      <ListItemButton
        sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }}
        dense={true}
        className="article-listitem"
      >
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <Box display="flex">
            <Stack sx={{ flexGrow: 1 }}>
              <Logo organizationId={props.organizationId} height={20} width={200} />
              <Typography variant="body1" color="text.primary">{props.title}</Typography>
              <Typography variant="caption" color="text.secondary">{hostname}</Typography>
            </Stack>
            <img src={props.imageUrl} alt={props.title} className="article-thumbnail" />
          </Box>
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

//
// biomarkerlistitem.tsx - a biomarker entry in a list of biomarkers
//

import Link from "next/link"
import Image from "next/image"

import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
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

  return (
    <Link href={props.url} passHref>
      <ListItemButton
        sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }}
        dense={true}
        className="article-listitem"
      >
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <Typography variant="h4">{props.title}</Typography>
          <img src={props.imageUrl} alt={props.title} className="article-thumbnail" />
          <Logo organizationId={props.organizationId} height={20} width={200} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

//
// biomarkerlistitem.tsx - a biomarker entry in a list of biomarkers
//

import Link from "next/link"
import Image from "next/image"

import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import IconButton from "@mui/material/IconButton"

import { getIcon } from "../components/icon"
import { Content } from "../lib/items/contents"
import { Logo } from "./logo"

export const FANCY_RADIUS = "74% 26% 61% 39% / 35% 30% 70% 65%"

/** Border radius to be applied to avatar image */
export type AvatarStyle = "round" | "rounded" | "square" | "fancy"

// TODO could come from theme
export const AVATAR_SIZE = 40

/** Returns a regular image or a next.js optimized image for local URLs */
export function getImage(src: string, alt: string, width?, height?, objectFit?, borderRadius?) {
  let image = null
  if (src) {
    if (src.startsWith("icon://")) {
      const icon = src.substring("icon://".length)
      return <IconButton>{getIcon(icon)}</IconButton>
    }

    if (src.startsWith("/")) {
      image = (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={95}
          sizes="50vw"
          layout="responsive"
          objectFit="cover"
        />
      )
    } else {
      image = <img src={src} alt={alt} width={width} height={height} style={{ objectFit }} />
    }
  }
  return (
    <Box width={width} height={height} sx={borderRadius && { overflow: "hidden", borderRadius }}>
      {image}
    </Box>
  )
}

/** Return an image sized for use in regular avatars */
export function getAvatarImage(src: string, alt: string, avatarStyle: AvatarStyle, size = AVATAR_SIZE) {
  let borderRadius = "50%"
  switch (avatarStyle) {
    case "rounded":
      borderRadius = "8px"
      break
    case "square":
      borderRadius = undefined
      break
    case "fancy":
      borderRadius = FANCY_RADIUS
      break
  }
  return getImage(src, alt, size, size, "cover", borderRadius)
}

/** A logo of the organization/source is shown on the right */
function getSecondaryAction(item) {
  if (item && item.organization) {
    return (
      <Box ml={2}>
        <Logo organizationId={item.organization} height={24} width={36} objectPosition="left center" />
      </Box>
    )
  }
  return null
}

export interface ListItemProps {
  /** The item to be shown (derived from Content) */
  item: Content

  /** Style of avatar image (default is round) */
  avatarStyle?: AvatarStyle

  /** Optional custom avatar item (default is to use imageUrl image instead) */
  avatar?: any

  /** Additional items to be shown on right hand side */
  secondaryAction?: any

  /** Display a dot badge with the given color (default none) */
  dotColor?: "default" | "success" | "primary" | "secondary" | "error" | "info" | "warning"
}

export function ContentListItem({ item, avatar, avatarStyle, secondaryAction, dotColor }: ListItemProps) {
  const primary = item.title
  const secondary = item.description

  if (!avatar && item.imageUrl) {
    avatar = getAvatarImage(item.imageUrl, item.title, avatarStyle)
    if (dotColor) {
      avatar = (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color={dotColor}
        >
          {avatar}
        </Badge>
      )
    }
  }

  return (
    <Link href={item.url} passHref>
      <ListItemButton sx={{ marginLeft: -2, borderStartEndRadius: 48, borderEndEndRadius: 48 }} dense={true}>
        <ListItem
          alignItems="flex-start"
          sx={{ marginTop: -1, marginBottom: -1 }}
          dense={true}
          secondaryAction={secondaryAction}
          disableGutters
        >
          <ListItemAvatar>{avatar}</ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

/** List item for generic references to external sources and contents */
export function ReferenceListItem(props: ListItemProps) {
  let item = { ...props.item }
  if (!item.url) {
    console.error(`ReferenceListItem - item: ${item.id} does not have an URL`, item)
    item.url = `/articles/${item.id}`
  }

  // TODO calculate reading time from content lenght
  if (item.url) {
    item.description = new URL(item.url).hostname + " · 3 min read"
  }

  return <ContentListItem item={item} avatarStyle="rounded" secondaryAction={getSecondaryAction(item)} />
}

/** List item specifically for internal (or blog) articles */
export function ArticleListItem(props: ListItemProps) {
  let item = { ...props.item, url: `/articles/${props.item.id}` }

  // a logo of the organization is shown on the right
  const secondaryAction = item.organization && (
    <Box ml={2}>
      <Logo organizationId={item.organization} height={24} width={36} objectPosition="left center" />
    </Box>
  )

  return <ContentListItem item={item} avatarStyle="rounded" secondaryAction={getSecondaryAction(item)} />
}

/** List item specifically for Topics */
export function TopicListItem(props: ListItemProps) {
  const item = { ...props.item, url: `/topics/${props.item.id}` }
  if (!item.description && item.biomarkers) {
    item.description = `${item.biomarkers.length} biomarkers`
  }
  return <ContentListItem item={item} avatarStyle="square" />
}

export function GenericListItem(props: ListItemProps) {
  const item = props.item

  switch (item.type) {
    case "reference":
      return <ReferenceListItem {...props} />
    case "topic":
      return <TopicListItem {...props} />
  }

  return <ContentListItem {...props} />
}

interface ListProps {
  items: Content[]
}

/** A general purpose list which picks item components automatically based on their types */
export function GenericList(props: ListProps) {
  return (
    <List>
      {props.items.map((item) => {
        if (!item.type) console.warn("GenericList - item %s is missing a type", item.id, item)
        return <GenericListItem item={item} />
      })}
    </List>
  )
}

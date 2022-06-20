//
// tags.tsx - tag chips for articles tags, amounts, etc
//

import React from "react"
import Link from "next/link"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Badge from "@mui/material/Badge"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"

import { Command, CommandEvent } from "../../lib/commands"

const Tag_SxProps: SxProps<Theme> = {
  ".MuiBadge-anchorOriginTopRight": {
    position: "relative",
    top: "6px",
    left: "-9px",
  },
  ".MuiChip-labelSmall": {
    position: "relative",
    top: "1px",
  },
}

//
// Tag - a clickable tag chip
//

export interface TagProps {
  /** Classname to be applied to component */
  className?: string

  /** Tag generates this command when clicked */
  command?: Command

  /** Label shown in chip (if command not provided) */
  title?: string

  /** Chip is clickable and takes to this page (optional) */
  href?: string

  /** Dot badge is shown in this color (optional) */
  dot?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"

  /** Chip size (default is medium) */
  size?: "medium" | "small"

  /** Callback for commands */
  onCommand?: CommandEvent
}

/** A clickable tag possibly showing a colored dot badge on it */
export function Tag(props: TagProps) {
  //
  // handlers
  //

  function handleClick(event) {
    const command = props.command || {
      command: "clickTag",
      args: { ...props },
    }
    props.onCommand(event, command)
  }

  const title = props.command?.title || props.title
  const clickable = props.onCommand || props.href ? true : false
  let tag = (
    <Chip
      className="Tag-chip"
      variant="outlined"
      onClick={props.onCommand ? handleClick : undefined}
      label={title}
      clickable={clickable}
      size={props.size}
    />
  )

  // wrap in dot badge?
  if (props.dot) {
    tag = (
      <Badge className="Tag-badge" color={props.dot} variant="dot">
        {tag}
      </Badge>
    )
  }

  // wrap in clickable link?
  if (props.href) {
    tag = (
      <Link className="Tag-link" href={props.href}>
        {tag}
      </Link>
    )
  }

  const className = "Tag-root" + (props.className ? " " + props.className : "")
  return (
    <Box className={className} sx={Tag_SxProps}>
      {tag}
    </Box>
  )
}

//
// Tags - a list of tags
//

export interface TagsProps {
  /** Class name to be given to this component */
  className?: string
  /** Properties of <Tag> items in the list */
  tags: TagProps[]
  /** Chip size (default is medium or as specified in tag itself) */
  size?: "medium" | "small"
  /** Callback for commands */
  onCommand?: CommandEvent
}

/** A list of tags */
export function Tags(props: TagsProps) {
  const className = "Tags-root" + (props.className ? " " + props.className : "")
  return (
    <Stack className={className} direction="row" spacing={1}>
      {props.tags &&
        props.tags.map((tagProps, idx) => (
          <Tag
            {...tagProps}
            key={idx}
            onCommand={tagProps.onCommand || props.onCommand}
            size={tagProps.size || props.size}
          />
        ))}
    </Stack>
  )
}

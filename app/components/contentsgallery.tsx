//
// contentsgallery.tsx
//

import React from "react"
import Link from "next/link"

import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"

import { Content } from "../lib/contents"

/** 2x2 and 1x2 items */
export const QUILT_SIZES = [
  { rows: 2, cols: 2 },
  { rows: 1, cols: 2 },
  { rows: 2, cols: 2 },
  { rows: 1, cols: 2 },
  { rows: 1, cols: 2 },
  { rows: 1, cols: 2 },
  { rows: 1, cols: 2 },
]

export const BLACK_TO_TOP_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"

interface ContentsGalleryProps {
  /** Items that should be shown in gallery (they should have a title and an imageUrl) */
  items: Content[]

  /** Size (in units) of each item, eg. QUILT_SIZES (defaults to 1x1 tiles) */
  sizes?: { rows: number; cols: number }[]

  /** Row height (defaults to 96) */
  rowHeight?: number

  /** Number of columns in total (defaults to 4) */
  cols?: number

  /** Gap between items (defaults to 4) */
  gap?: number
}

/** Shows a gallery of images with titles and optional subtitles arranged in tiles of variables sizes */
export function ContentsGallery({ items, sizes, rowHeight, cols, gap }: ContentsGalleryProps) {
  return (
    <ImageList sx={{ width: "100%" }} cols={cols || 4} rowHeight={rowHeight || 96} gap={gap || 4} variant="quilted">
      {items.map((item, index) => {
        let description = undefined
        if (item.title && item.description && item.title.toLowerCase() != item.description.toLowerCase()) {
          description = item.description
        }

        let itemSize = { rows: 1, cols: 1 }
        if (sizes) {
          itemSize = sizes[Math.min(sizes.length - 1, index)]
        }

        // TODO could have hover effects
        // TODO could add touch ripple to the image using ButtonBase
        // TODO could use next/image instead of regular image and pass image size, etc
        return (
          <Link key={item.id} href={item.url}>
            <ImageListItem rows={itemSize.rows} cols={itemSize.cols}>
              <img src={item.imageUrl} alt={item.title} loading="lazy" />
              <ImageListItemBar
                sx={{ background: BLACK_TO_TOP_GRADIENT }}
                title={item.title}
                subtitle={description}
                position="bottom"
              />
            </ImageListItem>
          </Link>
        )
      })}
    </ImageList>
  )
}

//
// biomarkerlistitem.tsx - a biomarker entry in a list of biomarkers
//

import Link from "next/link"
import Image from "next/image"

import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"

export interface BiomarkerListItemProps {
  biomarker: any
}

export function BiomarkerListItem({ biomarker }: BiomarkerListItemProps) {
  const biomarkerUrl = `/biomarkers/${biomarker.id}`

  // TODO biomarker itself could have an image url or a group of biomarkers could give it one
  const biomarkerImageUrl = "/biomarkers/blood.jpeg"

  return (
    <Link href={biomarkerUrl} key={biomarker.id}>
      <ListItem alignItems="flex-start" disableGutters>
        <ListItemAvatar>
          <Image src={biomarkerImageUrl} alt={biomarker.title} width={40} height={40} className="rounded" />
        </ListItemAvatar>
        <ListItemText primary={biomarker.title} secondary={biomarker.description} />
      </ListItem>
    </Link>
  )
}

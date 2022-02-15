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

export interface BiomarkerListItemProps {
  biomarker: any
}

export function BiomarkerListItem({ biomarker }: BiomarkerListItemProps) {
  // TODO biomarker itself could have an image url or a group of biomarkers could give it one
  const biomarkerImageUrl = "/biomarkers/blood.jpeg"

  // TODO we could make the text of list items a bit bigger in the theme itself
  // const primary = <Typography variant="body1">{biomarker.title}</Typography>
  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>

  return (
    <Link href={`/biomarkers/${biomarker.id}`} key={biomarker.id} passHref>
      <ListItemButton sx={{ marginLeft: -2, borderRadius: "8px" }}>
        <ListItem alignItems="flex-start" disableGutters>
          <ListItemAvatar>
            <Image src={biomarkerImageUrl} alt={biomarker.title} width={40} height={40} className="rounded" />
          </ListItemAvatar>
          <ListItemText primary={biomarker.title} secondary={biomarker.description} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

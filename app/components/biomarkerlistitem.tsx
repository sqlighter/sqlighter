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
  const primary = (
    <Typography variant="body1" noWrap={true}>
      {biomarker.title}
    </Typography>
  )
  // const secondary = <Typography variant="body2">{biomarker.description}</Typography>
  //const primary = biomarker.title
  const secondary = biomarker.description

  return (
    <Link href={`/biomarkers/${biomarker.id}`} key={biomarker.id} passHref>
      <ListItemButton sx={{ marginLeft: -2, marginRight: -2, borderRadius: "8px" }} dense={true}>
        <ListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <ListItemAvatar>
            <Image src={biomarkerImageUrl} alt={biomarker.title} width={40} height={40} className="rounded" />
          </ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      </ListItemButton>
    </Link>
  )
}

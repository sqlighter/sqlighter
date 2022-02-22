//
// biomarkerlistitem.tsx - a biomarker entry in a list of biomarkers
//

import Link from "next/link"
import Image from "next/image"

import MuiListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Typography from "@mui/material/Typography"

export interface BiomarkerListItemProps {
  item: any
}

export function BiomarkerListItem({ item }: BiomarkerListItemProps) {
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
        <MuiListItem alignItems="flex-start" disableGutters dense={true} sx={{ marginTop: -1, marginBottom: -1 }}>
          <ListItemAvatar>
            <Image src={biomarkerImageUrl} alt={item.title} width={40} height={40} className="rounded" />
          </ListItemAvatar>
          <ListItemText primary={primary} secondary={secondary} />
        </MuiListItem>
      </ListItemButton>
    </Link>
  )
}

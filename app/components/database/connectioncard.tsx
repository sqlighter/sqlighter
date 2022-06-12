//
// connectioncard.tsx
//

import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"

import { IconButton } from "../ui/iconbutton"
import { ConnectionIcon } from "./connectionicon"
import { DataConnection } from "../../lib/data/connections"

export interface ConnectionCardProps {
  connection: DataConnection
}

export function ConnectionCard(props: ConnectionCardProps) {
  return (
    <Card className="ConnectionCard-root" sx={{ width: 1 }} variant="outlined" square>
      <CardActionArea>
      <CardMedia
        component="img"
        height="194"
        image="/images/blank.png"
        alt="Paella dish"
      />
      <CardHeader
        avatar={<ConnectionIcon connection={props.connection} />}
        action={<IconButton command={{ command: "dosomethin", icon: "database", title: "Do it" }} />}
        title={props.connection.title}
        subheader="September 14, 2016"
      />
      </CardActionArea>
    </Card>
  )
}

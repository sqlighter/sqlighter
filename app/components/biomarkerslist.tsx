//
// biomarkerslist.tsx - a list of biomarkers
//

import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import { BiomarkerListItem } from "./biomarkerlistitem"

export interface BiomarkersListProps {
  title?: string
  biomarkers: any[]
}

export function BiomarkersList({ title, biomarkers }: BiomarkersListProps) {
  return (
    <section>
      {title && <Typography variant="overline">{title}</Typography>}
      <List dense disablePadding>
        {biomarkers.map((biomarker) => (
          <BiomarkerListItem biomarker={biomarker} />
        ))}
      </List>
    </section>
  )
}

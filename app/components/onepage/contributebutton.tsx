//
// contributebutton.tsx
//

import Button from "@mui/material/Button"
import { Icon } from "../ui/icon"

export function ContributeButton(props) {
  const variant = props.variant || "outlined"
  return (
    <Button variant={variant} href="https://github.com/sqlighter/sqlighter" size="large" startIcon={<Icon>github</Icon>}>
      Contribute
    </Button>
  )
}

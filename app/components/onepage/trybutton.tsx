//
// trybutton.tsx
//

import Button from "@mui/material/Button"
import { Icon } from "../ui/icon"

export function TryButton(props) {
  const variant = props.variant || "outlined"
  return (
    <Button variant={variant} href="/" size="large" startIcon={<Icon>sqlighter</Icon>}>
      Try Today
    </Button>
  )
}

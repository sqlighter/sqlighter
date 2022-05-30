//
// example.tsx - a simple component used to demo testing patterns
//

import React from "react"
import Button from "@mui/material/Button"
import { CommandEvent } from "../../lib/commands"

export interface ExampleProps {
  name: string
  onCommand: CommandEvent
}

export function Example(props) {
  function handleClick(event) {
    if (props.onCommand) {
      props.onCommand(event, {
        command: "clicked",
        args: { name: props.name },
      })
    }
  }

  return (
    <Button className="Example-root" variant="outlined" onClick={handleClick}>
      {props.name}
    </Button>
  )
}

//
// titlefield.tsx
//

import React from "react"
import { Theme, SxProps } from "@mui/material"
import { TextField, OutlinedTextFieldProps } from "@mui/material"
import { CommandEvent } from "../../lib/commands"

// styles applied to main and subcomponents
const TitleField_SxProps: SxProps<Theme> = {
  //  height: 40,

  // disable outline normally so it looks like a label, not an editfield
  "& .MuiOutlinedInput-root": {
    "& > fieldset": {
      borderColor: "transparent",
    },
  },

  // light outline on hover
  "&:hover .MuiOutlinedInput-root": {
    "& > fieldset": {
      borderColor: "text.secondary",
    },
  },

  "& .MuiOutlinedInput-root.Mui-focused": {
    "& > fieldset": {
      borderColor: "primary.main",
    },
  },
}

/** A text field used as editable title for panels */
export interface TitleFieldProps {
  /** Name to be assigned to this component (optional) */
  className?: string
  /** Value is required as title is a controlled component */
  value?: string
  /** The short hint displayed in the `input` before the user enters a value */
  placeholder?: string
  /** Callback used to dispatch commands back to parent component */
  onCommand?: CommandEvent
}

export function TitleField(props: TitleFieldProps) {
  //
  // handlers
  //

  function handleChange(event) {
    console.debug(`TitleField.handleChange - ${event.target.value}`)
    if (props.onCommand) {
      props.onCommand(event, { command: "changeTitle", args: { item: event.target.value } })
    }
  }

  //
  // render
  //

  const className = props.className ? "TitleField-root " + props.className : "TitleField-root"
  return (
    <TextField
      className={className}
      value={props.value}
      variant="outlined"
      multiline={false}
      fullWidth={true}
      placeholder={props.placeholder || "Title"}
      size="small"
      onChange={handleChange}
      sx={TitleField_SxProps}
    />
  )
}

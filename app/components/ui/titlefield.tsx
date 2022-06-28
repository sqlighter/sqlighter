//
// titlefield.tsx
//

import React from "react"
import { Theme, SxProps } from "@mui/material"
import { TextField } from "@mui/material"
import InputAdornment from "@mui/material/InputAdornment"

import { CommandEvent } from "../../lib/commands"
import { Icon } from "./icon"

// styles applied to main and subcomponents
const TitleField_SxProps: SxProps<Theme> = {
  ".MuiInput-input": {
    fontSize: (theme) => theme.typography.h6.fontSize,
  },

  // underline visible on hover and focus
  ".MuiInput-underline:before": {
    borderBottom: "transparent",
  },
  // hover (double-ampersand needed for specificity reasons.
  "&& .MuiInput-underline:hover:before": {
    borderBottomColor: "action.disabled",
  },
  // focused
  ".MuiInput-underline:after": {
    borderBottomColor: "primary.main",
  },

  // edit icon visible on hover and focus
  ".MuiInputAdornment-root": {
    color: "transparent",
  },
  "&:hover": {
    ".MuiInputAdornment-root": {
      color: "action.disabled",
    },
  },
  // TODO titlefield edit icon should use primary color when field is focused
  "&:after": {
    ".MuiInputAdornment-root": {
      color: "primary.main",
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

/** A textfield that can be used to titles that are rarely changed with low visual weight */
export function TitleField(props: TitleFieldProps) {
  //
  // handlers
  //

  function handleChange(event) {
    console.debug(`TitleField.handleChange - ${event.target.value}`)
    if (props.onCommand) {
      props.onCommand(event, { command: "changeTitle", args: { title: event.target.value } })
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
      variant="standard"
      multiline={false}
      fullWidth={true}
      placeholder={props.placeholder || "Title"}
      size="small" // small padding, large type
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Icon>edit</Icon>
          </InputAdornment>
        ),
      }}
      sx={TitleField_SxProps}
    />
  )
}

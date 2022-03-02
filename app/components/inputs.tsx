//
// inputs.tsx - text fields and other custom input field components
//

import { useState } from "react"
import AdapterDateFns from "@mui/lab/AdapterDayjs"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import DatePicker from "@mui/lab/DatePicker"
import TextField from "@mui/material/TextField"
import dayjs from "dayjs"
import { SxProps } from "@mui/material"
import { Theme } from "@mui/material/styles"
import InputAdornment from "@mui/material/InputAdornment"

interface InputProps {
  /** Id of text field component, also used to persist preferences */
  id: string

  label: string

  /** Initial value to be shown in input field */
  value?: any

  /** Callback used to notify of value changes */
  onChange?(value: any): void

  helperText?: string

  fullWidth?: boolean

  /** Style to be passed to component */
  sx?: SxProps<Theme>
}

interface DateInputProps extends InputProps {
  /** Minimum selectable date */
  minDate?: dayjs.Dayjs
}

/** A date picker */
export function DateInput(props: DateInputProps) {
  const [value, setValue] = useState(props.value)

  function onChange(value) {
    setValue(value)
    if (props.onChange) {
      props.onChange(value)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        minDate={props.minDate}
        label={props.label}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            id={props.id}
            margin="normal"
            helperText={props.helperText}
            InputLabelProps={{
              shrink: true,
            }}
            {...params}
            sx={props.sx}
          />
        )}
      />
    </LocalizationProvider>
  )
}

interface SelectInputProps extends InputProps {
  /** MenuItem choices */
  children: any
}

export function SelectInput(props: SelectInputProps) {
  const [value, setValue] = useState<string>(props.value)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  return (
    <TextField
      id={props.id}
      label={props.label}
      helperText={props.helperText}
      variant="outlined"
      select
      value={value}
      onChange={onChange}
      InputLabelProps={{
        shrink: true,
      }}
      sx={props.sx}
    >
      {props.children}
    </TextField>
  )
}

interface NumericInputProps extends InputProps {
  /** Measurement unit (primary), eg. 'kg' */
  unit?: string
}

/** A numeric input with measurement units, conversions, etc */
export function NumericInput(props: NumericInputProps) {
  const [value, setValue] = useState<string>(props.value)
  console.debug(`NumericInput - id: ${props.id}, value:${props.value}`)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.debug(`NumericInput.onChange - id: ${props.id}, value:${event.target.value}`)
    setValue(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  return (
    <TextField
      id={props.id}
      label={props.label}
      helperText={props.helperText}
      value={props.value}
      onChange={onChange}
      variant="outlined"
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*[.,]+[0-9]*",
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">{props.unit}</InputAdornment>,
      }}
      sx={props.sx}
    />
  )
}

//
// querystatus - database icon + query status and label like '203 rows in 0.3 s'
//

import React, { useState, useEffect } from "react"
import { Theme, SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import capitalize from "@mui/material/utils/capitalize"

import { DataConnection } from "../../lib/sqltr/connections"
import { QueryRun } from "../../lib/items/query"
import { formatSeconds } from "../client"
import { ConnectionIcon } from "./connectionpicker"
import { DotColor } from "../ui/icon"

// styles applied to main and subcomponents
const QueryStatus_SxProps: SxProps<Theme> = {
  display: "flex",

  ".QueryStatus-info": {
    ml: 1,
  },

  ".QueryStatus-label": {
    lineHeight: 1,
  },
}

export interface QueryStatusProps {
  /** Database connection used to run this query */
  connection?: DataConnection
  /** Data model for query run shown in panel */
  run: QueryRun
}

export function QueryStatus(props: QueryStatusProps) {
  const run = props.run
  const status = capitalize(run.status)

  //
  // state
  //

  // will update every 100ms while query is running
  const [version, setVersion] = useState(0)
  useEffect(() => {
    if (run.status === "running") {
      const interval = setInterval(() => setVersion(version + 1), 100)
      return () => clearInterval(interval)
    }
  }, [version])

  //
  // render
  //

  let dotColor: DotColor = "success"
  let titleColor = "success.main"
  let secondaryText = null
  const elapsed = formatSeconds(run.createdAt, run.updatedAt)
  switch (run.status) {
    case "completed":
      titleColor = "success.main"
      if (run.values) {
        secondaryText = `${run.values?.length} rows in ${elapsed}`
      } else {
        if (run.rowsModified !== undefined) {
          secondaryText = `${run.rowsModified} modified in ${elapsed}`
        }
      }
      break
    case "running":
      secondaryText = elapsed
      break
    case "error":
      dotColor = "error"
      titleColor = "error.main"
      break
  }

  return (
    <Box className="QueryStatus-root" sx={QueryStatus_SxProps}>
      <ConnectionIcon connection={props.connection} dotColor={dotColor} />
      <Box className="QueryStatus-info">
        <Typography className="QueryStatus-label" variant="body2" color={titleColor}>
          {status}
        </Typography>
        {secondaryText && (
          <Typography className="QueryStatus-secondaryLabel" variant="caption" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

//
// panelwithresults.tsx - panel with a header, a main part and a tabbed list of results
//

import Box from "@mui/material/Box"
import { Theme } from "@mui/material/styles"
import { SxProps } from "@mui/material"
import { Allotment } from "allotment"

import { Panel, PanelProps } from "./panel"
import { Tabs } from "./tabs"

export interface PanelWithResultsProps extends PanelProps {
  /** Main content, for example SQL editor */
  main?: any

  /** List of results that are shown as tabs (below) or boxes (on the side) */
  results?: PanelProps[]

  /** Results are shown in a tabbed panel at the bottom or as boxes on the right (default bottom) */
  variant?: "bottom" | "right"
}

/** A simple panel (used mostly to pass props to tabs or other layout componentsawer, header, footer, basic actions */
export function PanelWithResults(props: PanelWithResultsProps) {
  const { children, main, results, ...panelProps } = props

  /*
      {results &&
        results.map((result, index) => {
          return result.children
        })}

*/
  //        <Allotment.Pane>{results && <Tabs tabs={results} />}</Allotment.Pane>

  /*
              <Box sx={{ width: "100%", height: "100%", backgroundColor: "yellow" }}>
                {results && <Tabs tabs={results} />}
              </Box>


*/

  //               <Box sx={{ width: "100%", height: "100%", backgroundColor: "yellow" }}>
  /*
  return (
    <Allotment className="PanelWithResults-root" vertical={true}>
      <Allotment.Pane className="PanelWithResults-header" minSize={150} maxSize={150}>
        {children}
      </Allotment.Pane>
      <Allotment className="PanelWithResults-splitter" vertical={props.variant !== "right"} defaultSizes={[200, 200]}>
        <Allotment.Pane className="PanelWithResults-main" minSize={200}>
          {main}
        </Allotment.Pane>
        <Allotment.Pane className="PanelWithResults-results" minSize={200} maxSize={600}>
          {results?.length > 0 && results[0].children}
        </Allotment.Pane>
      </Allotment>
    </Allotment>
  )
*/

  const HEADER_HEIGHT = 150
  const MAIN_HEIGHT = 200

  return (
    <Box className="PanelWithResults-root" sx={{ display: "flex", flexDirection: "column", backgroundColor: "red" }}>
      <Box className="PanelWithResults-header" sx={{ height: HEADER_HEIGHT }}>
        {children}
      </Box>
      <Box sx={{ flexGrow: 1, backgroundColor: "beige" }}>{results?.length > 0 && results[0].children}</Box>
      <Box className="PanelWithResults-splitter" sx={{ height: MAIN_HEIGHT }}>
        {main}
      </Box>
    </Box>
  )

  /*
  return (
    <Box
      className="PanelWithResults-root"
      sx={{ width: "100%", height: "100%", backgroundColor: "beige", display: "flex", flexDirection: "column" }}
    >
      <Box>{children} this is panelwithresults.tsx</Box>
      <Box sx={{ minHeight: 300 }}>{results && results[0].children}</Box>
      <Box sx={{flexGrow: 1}}>{main}</Box>
    </Box>
  )*/
}

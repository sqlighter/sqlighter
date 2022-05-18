//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { useState } from "react"
import Box from "@mui/material/Box"

import { Tree } from "../../lib/data/tree"
import { FAKE_SCHEMAS } from "../../lib/data/sources"
import { TreeView } from "../navigation/treeview"

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel() {

  const [items, setItems] = useState(FAKE_SCHEMAS)

  //
  // handlers
  //

  function handleActionClick(event: React.SyntheticEvent, item: Tree, action: string) {
    console.debug(`DatabasePanel.handleActionClick - itemId: ${item.id}, action: ${action}`, item)
  
    switch(action) {
      case "collapse":
      case "expand":
        // handled by treeview
        break;
    }
  }

  //
  // render
  //

  return (
    <>
      <Box>Database schema panel (TBD)</Box>
      <TreeView items={items} onActionClick={handleActionClick} />
    </>
  )
}

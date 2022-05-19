//
// databasepanel.tsx - a panel used to show the schema of connected databases
// normally used as an activity shown with an icon in the activity bar and panel
// inside the sidebar. helps with new connections, shows tables, views, etc.
//

import { useState } from "react"
import Box from "@mui/material/Box"

import { Command } from "../../lib/data/commands"
import { Tree } from "../../lib/data/tree"
import { FAKE_SCHEMAS } from "../../lib/data/sources"
import { TreeView } from "../navigation/treeview"

/** A sidebar panel used to display the schema of connected databases */
export function DatabasePanel() {

  const [items, setItems] = useState(FAKE_SCHEMAS)

  //
  // handlers
  //

  function handleCommand(event: React.SyntheticEvent, command: Command, item: Tree) {
    console.debug(`DatabasePanel.handleCommand - command: ${command.command}, itemId: ${item.id}`, command, item)
  
    switch(command.command) {
      case "sqltr.collapseItem":
      case "sqltr.expandItem":
        // handled by treeview
        break;

      case "sqltr.viewData":
        break;
      case "sqltr.viewStructure":
        break;
      }
  }

  //
  // render
  //

  return (
    <>
      <Box>Database schema panel (TBD)</Box>
      <TreeView items={items} onCommand={handleCommand} />
    </>
  )
}

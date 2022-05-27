//
// app.tsx - sqlighter as a full page application
//

import * as React from "react"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import Head from "next/head"

import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { Typography } from "@mui/material"
import { Allotment } from "allotment"

import { Command, CommandEvent } from "../../lib/commands"
import { useSqljs } from "../hooks/useDB"
import { DataConnection, DataConnectionConfigs } from "../../lib/sqltr/connections"
import { SqliteDataConnection } from "../../lib/sqltr/databases/sqlite"
import { createQueryTab } from "./querypanel"

import { Icon } from "../../components/ui/icon"
import { Context } from "../../components/context"
import { TabsLayout } from "../../components/navigation/tabslayout"
import { PanelProps } from "../../components/navigation/panel"
import { DatabasePanel } from "./databasepanel"
import { QueryTab } from "./querytab"

const SSR = typeof window === "undefined"

const longText =
  "The start. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque efficitur, quam in tristique suscipit, felis mauris euismod ante, ut suscipit arcu justo in enim. Aenean finibus viverra enim, id commodo dolor porttitor luctus. Donec scelerisque, velit quis scelerisque auctor, metus tortor mattis tellus, vitae aliquam nisl erat a mauris. Donec mollis tincidunt venenatis. Morbi quis accumsan orci. Nam sodales orci eu purus ultricies, sed accumsan arcu tristique. Sed sed consequat velit, ut iaculis metus. Maecenas ut tellus eget ligula convallis sagittis. Duis a lorem at turpis volutpat porttitor nec sed nisl. Cras laoreet, nisl ac commodo consectetur, justo dolor pretium magna, tempus interdum odio sem sed velit. Nulla mattis, risus id semper pulvinar, ex dui venenatis nulla, nec fermentum ex nulla at ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam augue urna, sagittis vel urna non, posuere sodales orci. Quisque ac euismod lacus. Proin non rhoncus orci, id elementum elit. Maecenas ac ligula tincidunt, tempus leo et, luctus erat. Integer blandit accumsan neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus molestie sagittis massa, commodo ornare sem sodales eget. Praesent quis dictum arcu. Sed at nisl id lectus mollis convallis. In hac habitasse platea dictumst. In nec orci ac erat pretium auctor. Praesent ante purus, bibendum et ligula eu, dignissim viverra massa. Sed a facilisis enim. Morbi imperdiet felis eu enim faucibus dapibus. Duis scelerisque, turpis at tincidunt interdum, ex nisl pulvinar ligula, at porta tortor lacus a risus. Fusce id malesuada purus, a pulvinar sem. Fusce placerat lobortis turpis ac ultrices. Integer semper mollis dapibus. Suspendisse nibh eros, pulvinar et faucibus nec, lacinia ut turpis. Nunc sed nibh vel ante facilisis molestie. Nulla nec tempus turpis. Mauris pretium turpis sed enim suscipit, eu varius felis egestas. Pellentesque tortor libero, bibendum eget purus non, commodo ultrices elit. Donec laoreet est turpis, sed mollis lectus maximus nec. Nulla ullamcorper massa nisl, vel fermentum neque fringilla eu. Pellentesque eleifend vestibulum viverra. Sed eu consequat mauris. Maecenas dignissim tempus mauris, eget luctus risus congue at. Sed dictum enim ut nulla consectetur interdum. Mauris vitae enim viverra, pretium velit at, suscipit nisi. Fusce congue sed ex quis bibendum. Integer at magna ultricies, dapibus mauris ut, pulvinar risus. Phasellus maximus volutpat vestibulum. Aenean eu arcu non mauris scelerisque volutpat. Vestibulum bibendum urna ex, ut porttitor lacus fermentum commodo. Sed eu velit sit amet velit eleifend aliquam. Nullam a maximus sapien, sit amet tempus tortor. Donec interdum cursus dui, et pharetra tellus. Aenean leo turpis, laoreet sed mattis id, finibus id arcu. Nam eros dui, sodales sed pulvinar sit amet, faucibus et diam. Curabitur sit amet tellus eros. Maecenas ex sem, sodales vitae auctor vestibulum, pulvinar eu nisl. Morbi a diam non purus dignissim egestas. Nulla id ante consectetur, aliquam diam ac, iaculis sem. Donec vel semper ipsum. Nullam vel nisl imperdiet, aliquet urna vel, gravida mauris. Nulla vulputate purus nec metus viverra, non ultrices velit aliquam. Maecenas consequat nibh ut mi porta pulvinar. Etiam imperdiet lacus nec rhoncus porta. Integer suscipit eros arcu, in dictum elit rhoncus eget. Morbi ante erat, pretium vitae pharetra at, rutrum et ante. Nunc est augue, bibendum sit amet urna sed, viverra congue leo. Mauris justo sapien, luctus ut odio a, eleifend vehicula mauris. Maecenas finibus mauris at blandit feugiat. Aliquam malesuada euismod mollis. Phasellus massa risus, malesuada a dolor pretium, imperdiet elementum augue. Nullam dictum eget elit ultrices mollis. Sed eget tincidunt ante. Duis imperdiet facilisis purus eget placerat. In massa orci, mattis quis magna ut, iaculis porta ex. Vestibulum a dapibus turpis, sed auctor libero. Etiam posuere nulla mi, placerat ultricies ligula convallis id. Nunc lobortis quam ex, sagittis feugiat massa vulputate sed. Vivamus ut sem metus. Curabitur vehicula iaculis dolor molestie elementum. Vivamus pretium purus eu metus molestie, in blandit ipsum hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam tempor tellus felis, ac rhoncus odio consectetur in. Sed convallis mauris dolor, id facilisis lectus blandit eu. Nullam imperdiet est turpis, posuere tincidunt dolor sollicitudin ut. Duis at nunc sem. Vestibulum posuere erat imperdiet, porta risus sed, pharetra magna. Cras finibus, mi vel dictum efficitur, turpis tortor cursus lorem, non posuere elit urna sit amet enim. Ut convallis efficitur elit et condimentum. Morbi neque purus, aliquet mattis lobortis nec, maximus non urna. Morbi viverra lorem nec tortor pretium consectetur. Pellentesque congue enim maximus venenatis elementum. Suspendisse suscipit ex in facilisis mattis. Quisque et libero interdum, dignissim augue non, hendrerit lorem. Ut elementum enim vel orci convallis, id imperdiet magna vehicula. Sed sagittis mattis orci et dictum. Fusce tincidunt, lorem in suscipit gravida, felis velit pulvinar ex, sit amet condimentum mauris nisi eget velit. Praesent enim augue, sagittis eu porttitor aliquet, maximus ac nulla. Curabitur quis lacus faucibus, sagittis metus sit amet, ornare sapien. Donec vel quam ullamcorper, gravida ex a, laoreet justo. Sed aliquet eros eros. Phasellus et nisi neque. Sed sed vulputate felis. Aenean maximus sagittis scelerisque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tincidunt iaculis enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac scelerisque metus. Integer commodo libero vitae est pellentesque, vel ullamcorper ante dictum. Fusce mattis nibh et neque viverra, feugiat euismod tortor fringilla. Fusce mi mauris, consectetur vel orci vel, malesuada cursus mi. Etiam scelerisque suscipit enim in porta. Sed felis elit, auctor et lacus ut, commodo semper nisl. Nulla facilisi. Proin vel neque massa. Aliquam eu odio congue, elementum orci vel, sagittis purus. Donec sed elit quis nibh fringilla hendrerit ut id sem. Mauris turpis purus, molestie laoreet ultricies et, posuere in odio. Morbi iaculis placerat feugiat. Mauris porttitor at sem eu ullamcorper. Praesent sodales rhoncus iaculis. Donec ex nibh, malesuada ac mauris quis, auctor sagittis eros. Fusce a augue eget lectus porta malesuada a id neque. Sed nec metus sed purus dignissim mattis et non nisl. Cras vel orci nec tellus fringilla iaculis ultrices a purus. In sed felis ullamcorper, vulputate massa at, blandit magna. Mauris porta ex tellus, sed venenatis tortor mattis at. Nullam auctor ex eget diam pellentesque bibendum. Mauris consectetur lectus egestas tellus lobortis ullamcorper. Duis at massa tincidunt, condimentum magna eget, vehicula massa. Fusce elementum tellus a est commodo, at tincidunt mi fringilla. Mauris ornare placerat quam vitae vehicula. Phasellus condimentum faucibus sodales. In lorem nisl, sagittis a condimentum non, tincidunt in erat. Proin non auctor tortor. Curabitur ac volutpat sapien. Praesent blandit dui nibh, quis semper nunc tempus non. Nullam ac lorem mauris. Nullam ultrices diam purus, id ultricies mauris malesuada quis. Vestibulum semper, lectus vel fermentum rhoncus, neque nunc sodales arcu, ut venenatis ipsum libero non tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vel lacinia odio. Pellentesque laoreet ut nunc nec faucibus. Vivamus id augue nec felis vulputate facilisis. Vestibulum pretium sit amet neque sed pulvinar. Suspendisse potenti. Nunc eu rutrum est. Phasellus magna velit, euismod ac accumsan ut, hendrerit sit amet mauris. Mauris interdum eget tellus non accumsan. Etiam tincidunt arcu eget congue accumsan. Sed in turpis id odio mollis sagittis a sed justo. Proin pretium maximus posuere. Mauris sit amet sollicitudin metus. Aliquam mattis, nulla at dapibus ultrices, justo sapien tempus purus, in posuere augue erat et ligula. Quisque luctus elit rhoncus ante blandit ultricies sed eu augue. Vestibulum venenatis tortor urna, sit amet rhoncus nisi fringilla sed. Vivamus lacus leo, fermentum vel libero in, faucibus finibus ante. Maecenas augue metus, molestie sit amet maximus ut, consequat at mauris. In viverra dui urna, in molestie ipsum placerat ac. Fusce ac pharetra felis, vitae condimentum metus. Sed ut sodales sem. Aliquam ac lorem ac lorem fringilla iaculis ut at odio. Cras sagittis auctor metus vel auctor. Donec id turpis dignissim, vehicula sapien a, blandit est. Vivamus nibh elit, pulvinar non ullamcorper in, maximus non est. Morbi molestie placerat augue, quis feugiat nunc molestie vel. Cras bibendum aliquam justo, vitae fringilla mi pulvinar vitae. Cras libero nulla, porttitor a efficitur a, lacinia quis massa. Duis quis purus eu ipsum aliquam maximus vel vel felis. Praesent aliquam ac nunc et convallis. Etiam commodo augue id gravida feugiat. Donec rutrum sem eget purus rhoncus, vel efficitur purus ultricies. Nam auctor, dui ac lacinia congue, metus libero vulputate tellus, ut dapibus erat orci quis felis. Ut ac aliquet nulla. Vestibulum varius consequat dui at fringilla. Ut mauris elit, finibus pharetra orci ac, tempus hendrerit libero. Morbi eget orci consequat, facilisis metus quis, laoreet tortor. Maecenas aliquet risus nunc, quis dignissim lorem finibus id. Nulla at vulputate ante. Ut et ligula non justo malesuada tincidunt eu in ante. Pellentesque aliquet porta congue. Morbi lacinia fermentum elit, vitae consequat mi commodo varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque efficitur, quam in tristique suscipit, felis mauris euismod ante, ut suscipit arcu justo in enim. Aenean finibus viverra enim, id commodo dolor porttitor luctus. Donec scelerisque, velit quis scelerisque auctor, metus tortor mattis tellus, vitae aliquam nisl erat a mauris. Donec mollis tincidunt venenatis. Morbi quis accumsan orci. Nam sodales orci eu purus ultricies, sed accumsan arcu tristique. Sed sed consequat velit, ut iaculis metus. Maecenas ut tellus eget ligula convallis sagittis. Duis a lorem at turpis volutpat porttitor nec sed nisl. Cras laoreet, nisl ac commodo consectetur, justo dolor pretium magna, tempus interdum odio sem sed velit. Nulla mattis, risus id semper pulvinar, ex dui venenatis nulla, nec fermentum ex nulla at ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam augue urna, sagittis vel urna non, posuere sodales orci. Quisque ac euismod lacus. Proin non rhoncus orci, id elementum elit. Maecenas ac ligula tincidunt, tempus leo et, luctus erat. Integer blandit accumsan neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus molestie sagittis massa, commodo ornare sem sodales eget. Praesent quis dictum arcu. Sed at nisl id lectus mollis convallis. In hac habitasse platea dictumst. In nec orci ac erat pretium auctor. Praesent ante purus, bibendum et ligula eu, dignissim viverra massa. Sed a facilisis enim. Morbi imperdiet felis eu enim faucibus dapibus. Duis scelerisque, turpis at tincidunt interdum, ex nisl pulvinar ligula, at porta tortor lacus a risus. Fusce id malesuada purus, a pulvinar sem. Fusce placerat lobortis turpis ac ultrices. Integer semper mollis dapibus. Suspendisse nibh eros, pulvinar et faucibus nec, lacinia ut turpis. Nunc sed nibh vel ante facilisis molestie. Nulla nec tempus turpis. Mauris pretium turpis sed enim suscipit, eu varius felis egestas. Pellentesque tortor libero, bibendum eget purus non, commodo ultrices elit. Donec laoreet est turpis, sed mollis lectus maximus nec. Nulla ullamcorper massa nisl, vel fermentum neque fringilla eu. Pellentesque eleifend vestibulum viverra. Sed eu consequat mauris. Maecenas dignissim tempus mauris, eget luctus risus congue at. Sed dictum enim ut nulla consectetur interdum. Mauris vitae enim viverra, pretium velit at, suscipit nisi. Fusce congue sed ex quis bibendum. Integer at magna ultricies, dapibus mauris ut, pulvinar risus. Phasellus maximus volutpat vestibulum. Aenean eu arcu non mauris scelerisque volutpat. Vestibulum bibendum urna ex, ut porttitor lacus fermentum commodo. Sed eu velit sit amet velit eleifend aliquam. Nullam a maximus sapien, sit amet tempus tortor. Donec interdum cursus dui, et pharetra tellus. Aenean leo turpis, laoreet sed mattis id, finibus id arcu. Nam eros dui, sodales sed pulvinar sit amet, faucibus et diam. Curabitur sit amet tellus eros. Maecenas ex sem, sodales vitae auctor vestibulum, pulvinar eu nisl. Morbi a diam non purus dignissim egestas. Nulla id ante consectetur, aliquam diam ac, iaculis sem. Donec vel semper ipsum. Nullam vel nisl imperdiet, aliquet urna vel, gravida mauris. Nulla vulputate purus nec metus viverra, non ultrices velit aliquam. Maecenas consequat nibh ut mi porta pulvinar. Etiam imperdiet lacus nec rhoncus porta. Integer suscipit eros arcu, in dictum elit rhoncus eget. Morbi ante erat, pretium vitae pharetra at, rutrum et ante. Nunc est augue, bibendum sit amet urna sed, viverra congue leo. Mauris justo sapien, luctus ut odio a, eleifend vehicula mauris. Maecenas finibus mauris at blandit feugiat. Aliquam malesuada euismod mollis. Phasellus massa risus, malesuada a dolor pretium, imperdiet elementum augue. Nullam dictum eget elit ultrices mollis. Sed eget tincidunt ante. Duis imperdiet facilisis purus eget placerat. In massa orci, mattis quis magna ut, iaculis porta ex. Vestibulum a dapibus turpis, sed auctor libero. Etiam posuere nulla mi, placerat ultricies ligula convallis id. Nunc lobortis quam ex, sagittis feugiat massa vulputate sed. Vivamus ut sem metus. Curabitur vehicula iaculis dolor molestie elementum. Vivamus pretium purus eu metus molestie, in blandit ipsum hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam tempor tellus felis, ac rhoncus odio consectetur in. Sed convallis mauris dolor, id facilisis lectus blandit eu. Nullam imperdiet est turpis, posuere tincidunt dolor sollicitudin ut. Duis at nunc sem. Vestibulum posuere erat imperdiet, porta risus sed, pharetra magna. Cras finibus, mi vel dictum efficitur, turpis tortor cursus lorem, non posuere elit urna sit amet enim. Ut convallis efficitur elit et condimentum. Morbi neque purus, aliquet mattis lobortis nec, maximus non urna. Morbi viverra lorem nec tortor pretium consectetur. Pellentesque congue enim maximus venenatis elementum. Suspendisse suscipit ex in facilisis mattis. Quisque et libero interdum, dignissim augue non, hendrerit lorem. Ut elementum enim vel orci convallis, id imperdiet magna vehicula. Sed sagittis mattis orci et dictum. Fusce tincidunt, lorem in suscipit gravida, felis velit pulvinar ex, sit amet condimentum mauris nisi eget velit. Praesent enim augue, sagittis eu porttitor aliquet, maximus ac nulla. Curabitur quis lacus faucibus, sagittis metus sit amet, ornare sapien. Donec vel quam ullamcorper, gravida ex a, laoreet justo. Sed aliquet eros eros. Phasellus et nisi neque. Sed sed vulputate felis. Aenean maximus sagittis scelerisque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tincidunt iaculis enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac scelerisque metus. Integer commodo libero vitae est pellentesque, vel ullamcorper ante dictum. Fusce mattis nibh et neque viverra, feugiat euismod tortor fringilla. Fusce mi mauris, consectetur vel orci vel, malesuada cursus mi. Etiam scelerisque suscipit enim in porta. Sed felis elit, auctor et lacus ut, commodo semper nisl. Nulla facilisi. Proin vel neque massa. Aliquam eu odio congue, elementum orci vel, sagittis purus. Donec sed elit quis nibh fringilla hendrerit ut id sem. Mauris turpis purus, molestie laoreet ultricies et, posuere in odio. Morbi iaculis placerat feugiat. Mauris porttitor at sem eu ullamcorper. Praesent sodales rhoncus iaculis. Donec ex nibh, malesuada ac mauris quis, auctor sagittis eros. Fusce a augue eget lectus porta malesuada a id neque. Sed nec metus sed purus dignissim mattis et non nisl. Cras vel orci nec tellus fringilla iaculis ultrices a purus. In sed felis ullamcorper, vulputate massa at, blandit magna. Mauris porta ex tellus, sed venenatis tortor mattis at. Nullam auctor ex eget diam pellentesque bibendum. Mauris consectetur lectus egestas tellus lobortis ullamcorper. Duis at massa tincidunt, condimentum magna eget, vehicula massa. Fusce elementum tellus a est commodo, at tincidunt mi fringilla. Mauris ornare placerat quam vitae vehicula. Phasellus condimentum faucibus sodales. In lorem nisl, sagittis a condimentum non, tincidunt in erat. Proin non auctor tortor. Curabitur ac volutpat sapien. Praesent blandit dui nibh, quis semper nunc tempus non. Nullam ac lorem mauris. Nullam ultrices diam purus, id ultricies mauris malesuada quis. Vestibulum semper, lectus vel fermentum rhoncus, neque nunc sodales arcu, ut venenatis ipsum libero non tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent vel lacinia odio. Pellentesque laoreet ut nunc nec faucibus. Vivamus id augue nec felis vulputate facilisis. Vestibulum pretium sit amet neque sed pulvinar. Suspendisse potenti. Nunc eu rutrum est. Phasellus magna velit, euismod ac accumsan ut, hendrerit sit amet mauris. Mauris interdum eget tellus non accumsan. Etiam tincidunt arcu eget congue accumsan. Sed in turpis id odio mollis sagittis a sed justo. Proin pretium maximus posuere. Mauris sit amet sollicitudin metus. Aliquam mattis, nulla at dapibus ultrices, justo sapien tempus purus, in posuere augue erat et ligula. Quisque luctus elit rhoncus ante blandit ultricies sed eu augue. Vestibulum venenatis tortor urna, sit amet rhoncus nisi fringilla sed. Vivamus lacus leo, fermentum vel libero in, faucibus finibus ante. Maecenas augue metus, molestie sit amet maximus ut, consequat at mauris. In viverra dui urna, in molestie ipsum placerat ac. Fusce ac pharetra felis, vitae condimentum metus. Sed ut sodales sem. Aliquam ac lorem ac lorem fringilla iaculis ut at odio. Cras sagittis auctor metus vel auctor. Donec id turpis dignissim, vehicula sapien a, blandit est. Vivamus nibh elit, pulvinar non ullamcorper in, maximus non est. Morbi molestie placerat augue, quis feugiat nunc molestie vel. Cras bibendum aliquam justo, vitae fringilla mi pulvinar vitae. Cras libero nulla, porttitor a efficitur a, lacinia quis massa. Duis quis purus eu ipsum aliquam maximus vel vel felis. Praesent aliquam ac nunc et convallis. Etiam commodo augue id gravida feugiat. Donec rutrum sem eget purus rhoncus, vel efficitur purus ultricies. Nam auctor, dui ac lacinia congue, metus libero vulputate tellus, ut dapibus erat orci quis felis. Ut ac aliquet nulla. Vestibulum varius consequat dui at fringilla. Ut mauris elit, finibus pharetra orci ac, tempus hendrerit libero. Morbi eget orci consequat, facilisis metus quis, laoreet tortor. Two more lines. Maecenas aliquet risus nunc, quis dignissim lorem finibus id. Nulla at vulputate ante. Ut et ligula non justo malesuada tincidunt eu in ante. Pellentesque aliquet porta congue. Morbi lacinia fermentum elit, vitae consequat mi commodo varius. The End."

const TABS: PanelProps[] = [
  {
    id: "tab0",
    title: "Query 0",
    description: "description of tab 0",
    icon: "query",
    sx: { backgroundColor: "beige" },
    children: <>Tab zero panel</>,
  },
  {
    id: "tab1",
    title: "Allotment 1",
    description: "description of tab 1",
    icon: "query",
    sx: { backgroundColor: "blue" },
    children: <QueryTab />,
  },
  {
    id: "tab2",
    title: "LongText2",
    description: "description of tab 3",
    icon: "database",
    sx: { backgroundColor: "yellow" },
    children: <Box sx={{ backgroundColor: "yellow" }}>{longText}</Box>,
  },
  {
    id: "tab3",
    title: "Table 3",
    description: "description of tab 3",
    icon: "database",
    sx: { backgroundColor: "yellow", height: "100%", maxHeight: "100%" },
    children: <>Tab 3 panel full height</>,
  },
]

/*
const SQLighterComponentWithNoSSR = dynamic(
  () => import('../components/layouts/tabsapp'),
  { ssr: false }
)
*/

const title = "SQLighter"

/** Main component for SQLighter app which includes activities, sidebar, tabs, etc... */
export default function Main(props) {
  //  <SQLighterComponentWithNoSSR />
  const context = React.useContext(Context)

  const [activityValue, setActivityValue] = useState("databaseActivity")
  const [tabValue, setTabValue] = useState("tab1")
  const [tabs, setTabs] = useState<PanelProps[]>(TABS)

  // all connections
  const [connections, setConnections] = useState<DataConnection[]>(null)

  // selected connection
  const [connection, setConnection] = useState<DataConnection>(null)

  //
  // temporary code while we work out the connection setup panels, etc
  //

  const sqljs = useSqljs()
  useEffect(() => {
    if (sqljs) {
      console.log("DatabasePanel - has sqljs")
    }
  }, [sqljs])

  async function openSomeTestConnection() {
    if (sqljs) {
      //      const response = await fetch("/chinook.sqlite")
      const response = await fetch("/test.db")
      const buffer = await response.arrayBuffer()
      console.log("downloaded", response, buffer)
      const configs: DataConnectionConfigs = {
        client: "sqlite3",
        connection: {
          buffer: new Uint8Array(buffer) as Buffer,
        },
      }

      const conn = await SqliteDataConnection.create(configs, sqljs)
      console.debug(`openSomeTestConnection - opened`, conn)
      // faking it a bit for now to have a list of connections
      setConnection(conn)
      setConnections([conn, conn, conn])
    } else [console.error(`DatabasePanel.handleOpenClick - sqljs engine not loaded`)]
  }

  //
  // activities
  //

  const activities: PanelProps[] = [
    {
      id: "databaseActivity",
      title: "Database",
      description: "Database Schema",
      icon: "database",
      sx: { width: "100%", height: "100%" },
      children: <DatabasePanel connection={connection} connections={connections} onCommand={handleCommand} />,
    },
    {
      id: "queriesActivity",
      title: "Queries",
      description: "Saved Queries",
      icon: "query",
      sx: { width: "100%", height: "100%" },
      children: <>Saved queries activity</>,
    },
    {
      id: "historyActivity",
      title: "History",
      description: "History description",
      icon: "history",
      children: <>History activity</>,
    },
  ]

  //
  // handlers
  //

  function handleActivityChange(_, activityId) {
    console.debug(`App.handleActivityChange - activityId: ${activityId}`)
  }

  function handleTabsChange(tabId?: string, tabs?: PanelProps[]) {
    console.debug(`handleTabsChange - tabId: ${tabId}, tabs: ${tabs && tabs.map((t) => t.id).join(", ")}`)
    setTabs(tabs)
    setTabValue(tabId)
  }

  function handleAddTabClick(e: React.MouseEvent<HTMLElement>): void {
    // console.debug("Main.handleAddTabClick", e)
  }

  async function handleCommand(event: React.SyntheticEvent, command: Command) {
    console.debug(`Main.handleCommand - ${command.command}`, command)
    switch (command.command) {
      case "sqlighter.manageConnections":
        await openSomeTestConnection()
        break

      case "sqlighter.viewQuery":
        // open a new tab with a query panel
        const queryTab = createQueryTab(command, connection, connections)
        setTabs([queryTab, ...tabs])
        setTabValue(queryTab.id)
        break
    }
  }

  //
  // rendering
  //

  return (
    <TabsLayout
      title="SQLighter"
      description="Lighter, mightier"
      //
      activities={activities}
      onActivityChange={handleActivityChange}
      //
      tabs={tabs}
      onTabsChange={handleTabsChange}
      onAddTabClick={handleAddTabClick}
      //
      user={context.user}
    />
  )
}

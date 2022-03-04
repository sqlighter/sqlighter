//
// footer.tsx - implements main bottom navigation
//

import { useRouter } from "next/router"

import * as React from "react"
import Paper from "@mui/material/Paper"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import Toolbar from "@mui/material/Toolbar"

import JournalIcon from "@mui/icons-material/AssignmentOutlined"
import LibraryIcon from "@mui/icons-material/LocalLibraryOutlined"
import ProfileIcon from "@mui/icons-material/PersonOutlineOutlined"

export function Footer() {
  const router = useRouter()

  // if pathname is '/library/biomarkers/glucose' pathSegments[0] will be 'library'
  console.assert(
    router?.pathname?.length > 1 && router?.pathname?.startsWith("/"),
    `Footer - pathname missing or doesn't start with /, pathname: ${router.pathname}`
  )
  let pathSegments = router?.pathname?.length > 1 && router.pathname.substring(1).split("/")

  function navigateTo(event, newPath: string) {
    router.push("/" + newPath)
  }

  return (
    <>
      <Toolbar />
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={1}>
        <BottomNavigation value={pathSegments?.[0]} onChange={navigateTo} color="primary" showLabels>
          <BottomNavigationAction label="Journal" value="journal" icon={<JournalIcon />} />
          <BottomNavigationAction label="Library" value="library" icon={<LibraryIcon />} />
          <BottomNavigationAction label="Profile" value="profile" icon={<ProfileIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  )
}

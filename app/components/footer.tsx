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
import BrowseIcon from "@mui/icons-material/FormatListBulletedOutlined"
import ProfileIcon from "@mui/icons-material/PersonOutlineOutlined"

const Footer = () => {
  const router = useRouter()

  // if pathname is '/browse/biomarkers/glucose' pathSegments[0] will be 'browse'
  console.assert(router.pathname.length > 1 && router.pathname.startsWith("/"))
  let pathSegments = router.pathname.length > 1 && router.pathname.substring(1).split("/")

  function navigateTo(event, newPath: string) {
    router.push("/" + newPath)
  }

  return (
    <>
      <Toolbar />
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={pathSegments[0]} onChange={navigateTo} showLabels>
          <BottomNavigationAction label="Journal" value="journal" icon={<JournalIcon />} />
          <BottomNavigationAction label="Browse" value="browse" icon={<BrowseIcon />} />
          <BottomNavigationAction label="Profile" value="profile" icon={<ProfileIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  )
}

export default Footer

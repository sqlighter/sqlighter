//
// theme.tsx - theme used to style app components
//

import { createTheme } from "@mui/system"

// https://mui.com/customization/default-theme/#main-content

// https://bareynol.github.io/mui-theme-creator/
export const theme = createTheme({
  palette: {
    primary: {
      light: "#e5eefb",
      main: "#3871e0",
      dark: "#284da0",
    },
    secondary: {
      light: "#58c0a7",
      main: "#387e6e",
    },
    background: {
      /*   paper: "#fF00FF", */
    },
    text: {
      primary: "#3d4043",
      secondary: "#606367",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      500: "#009688",
    },
  },
})

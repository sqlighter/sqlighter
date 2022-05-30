//
// theme.tsx - custom theme applied to all components of the application
//

import { lighten, rgbToHex, createTheme, Theme, SxProps } from "@mui/material/styles"

// Theming
// https://bareynol.github.io/mui-theme-creator/
// https://mui.com/customization/theming/

declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface PaletteOptions {
    materialyou?: {
      primary?: {
        light?: string
        lighter?: string
        lightest?: string
      }
    }
  }
}

// coefficients used to make colors lighter
const LIGHT = 0.92
const LIGHTER = 0.95
const LIGHTEST = 0.97

export const PRIMARY_COLOR = "#0072e5" // blue
export const PRIMARY_LIGHT = rgbToHex(lighten(PRIMARY_COLOR, LIGHT))
export const PRIMARY_LIGHTER = rgbToHex(lighten(PRIMARY_COLOR, LIGHTER))
export const PRIMARY_LIGHTEST = rgbToHex(lighten(PRIMARY_COLOR, LIGHTEST))

export const BORDER_RADIUS_FANCY = "74% 26% 61% 39% / 35% 30% 70% 65%"

export const customSx: SxProps<Theme> = {

  // https://material.io/blog/roboto-flex
  // https://m3.material.io/styles/typography/type-scale-tokens
  ".Typography-root": {
    fontFamily: "'Roboto Flex', sans-serif",
    letterSpacing: 0,
  },
  ".Typography-displayLarge": {
    fontWeight: 400,
    lineHeight: "64px",
    fontSize: "57px",
  },
  ".Typography-displayMedium": {
    fontWeight: 400,
    lineHeight: "52px",
    fontSize: "45px",
  },
  ".Typography-displaySmall": {
    fontWeight: 400,
    lineHeight: "44px",
    fontSize: "36px",
  },
  ".Typography-headlineLarge": {
    fontWeight: 400,
    lineHeight: "40px",
    fontSize: "32px",
  },
  ".Typography-headlineMedium": {
    fontWeight: 400,
    lineHeight: "36px",
    fontSize: "28px",
  },
  ".Typography-headlineSmall": {
    fontWeight: 400,
    lineHeight: "32px",
    fontSize: "24px",
  },
  ".Typography-titleLarge": {
    fontWeight: 400,
    lineHeight: "28px",
    fontSize: "22px",
  },
  ".Typography-titleMedium": {
    fontWeight: 500,
    lineHeight: "24px",
    fontSize: "16px",
  },
  ".Typography-titleSmall": {
    fontWeight: 500,
    lineHeight: "20px",
    fontSize: "14px",
    letterSpacing: 0.1,
  },
  ".Typography-labelLarge": {
    fontWeight: 500,
    lineHeight: "20px",
    fontSize: "14px",
    letterSpacing: 0.1,
  },
  ".Typography-labelMedium": {
    fontWeight: 500,
    lineHeight: "16px",
    fontSize: "12px",
    letterSpacing: 0.5,
  },
  ".Typography-labelSmall": {
    fontWeight: 500,
    lineHeight: "16px",
    fontSize: "11px",
    letterSpacing: 0.5,
  },
  ".Typography-bodyLarge": {
    fontWeight: 400,
    lineHeight: "24px",
    fontSize: "16px",
    letterSpacing: 0.5,
  },
  ".Typography-bodyMedium": {
    fontWeight: 400,
    lineHeight: "20px",
    fontSize: "14px",
    letterSpacing: 0.25,
  },
  ".Typography-bodySmall": {
    fontWeight: 400,
    lineHeight: "16px",
    fontSize: "12px",
    letterSpacing: 0.4,
  },




}

export function customTheme() {
  const baseTheme = createTheme({
    palette: {
      primary: {
        main: PRIMARY_COLOR,
      },
      secondary: {
        main: "#7ab6a8",
      },
      background: {
        default: PRIMARY_LIGHTEST,
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
      materialyou: {
        primary: {
          light: PRIMARY_LIGHT,
          lighter: PRIMARY_LIGHTER,
          lightest: PRIMARY_LIGHTEST,
        },
      },
      tonalOffset: 0.4,
    },

    typography: {
      // https://mui.com/customization/typography/#self-hosted-fonts
      fontFamily: "'Roboto Flex', Helvetica, Arial, sans-serif",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 700,
      fontWeightBold: 900,
    },
  })

  const customTheme = createTheme(baseTheme, {
    typography: {
      h1: {
        fontWeight: 900,
        fontSize: baseTheme.typography.h3.fontSize,
        lineHeight: baseTheme.typography.h3.lineHeight,
        letterSpacing: baseTheme.typography.h3.letterSpacing,
      },
      h2: {
        fontWeight: 900,
        fontSize: baseTheme.typography.h4.fontSize,
        lineHeight: baseTheme.typography.h4.lineHeight,
        letterSpacing: baseTheme.typography.h4.letterSpacing,
      },
      h3: {
        fontWeight: 900,
        fontSize: baseTheme.typography.h5.fontSize,
        lineHeight: baseTheme.typography.h5.lineHeight,
        letterSpacing: baseTheme.typography.h5.letterSpacing,
      },
      h4: {
        fontWeight: 900,
        fontSize: baseTheme.typography.h6.fontSize,
        lineHeight: baseTheme.typography.h6.lineHeight,
        letterSpacing: baseTheme.typography.h6.letterSpacing,
      },
      h5: {
        fontWeight: 900,
        fontSize: "1rem",
        lineHeight: "1.1",
        letterSpacing: "0em",
      },
      h6: {
        fontWeight: 900,
        fontSize: "1rem",
        lineHeight: "1",
        letterSpacing: "0em",
      },
    },

    components: {
      MuiIcon: {
        defaultProps: {
          // Replace the `material-icons` default value.
          baseClassName: "material-icons-outlined",
        },
      },

      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: PRIMARY_LIGHTEST,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            color: baseTheme.palette.text.primary,
            backgroundColor: PRIMARY_LIGHTEST,
          },
        },
      },

      MuiBadge: {
        styleOverrides: {
          badge: {
            // add a bit of white border around the dot that makes it stand out
            // TODO could have animation from https://mui.com/components/avatars/#with-badge
            boxShadow: `0 0 0 2px ${baseTheme.palette.background.paper}`,

            // TODO dot is on top of bottom navigation, why? https://mui.com/customization/z-index/
            zIndex: baseTheme.zIndex.appBar - 1,
          },
        },
      },
    },
  })

  return customTheme
}

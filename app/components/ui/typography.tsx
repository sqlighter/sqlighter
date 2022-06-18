//
// typography.tsx - simplified typography choices styled after material 3 specs
//
// Recommended usage (simplified typescale):
// - Display/medium
//   - Headline/medium
//     - Title/large
//       - Title/medium + Body/medium
//       - Title/small + Body/small
//       - Label/medium
//
// Material Design 3, Typography Overview
// https://m3.material.io/styles/typography/overview
// Fonts
// https://m3.material.io/styles/typography/fonts
// Type scale and tokens
// https://m3.material.io/styles/typography/type-scale-tokens
// Applying type
// https://m3.material.io/styles/typography/applying-type
// Roboto Flex (light 300, regular 400, medium 500, semibold 600)
// https://fonts.google.com/specimen/Roboto+Flex
//

import { Typography, TypographyProps as MuiTypographyProps } from "@mui/material"

export interface TypographyProps extends MuiTypographyProps {
  /** Class name to be applied to this element's root (optional) */
  className?: string

  /** Relative size, defaults to medium */
  size?: "small" | "medium" | "large"
}

export function Display(props: TypographyProps) {
  switch (props.size) {
    case "large":
      // use sparingly
      return <Typography variant="h2" {...props} />
    case "small":
      // use sparingly
      return <Typography variant="h4" {...props} />
  }
  // recommended
  return <Typography variant="h3" {...props} />
}

export function Headline(props: TypographyProps) {
  switch (props.size) {
    case "large":
      // use sparingly
      return <Typography variant="h4" {...props} />
    case "small":
      // use sparingly
      return <Typography variant="h6" {...props} />
  }
  // recommended
  return <Typography variant="h5" {...props} />
}

export function Title(props: TypographyProps) {
  switch (props.size) {
    case "large":
      // recommended
      return <Typography variant="h6" {...props} />
    case "small":
      // recommended
      return <Typography variant="subtitle2" {...props} />
  }
  // recommended
  return <Typography variant="subtitle1" {...props} />
}

export function Body(props: TypographyProps) {
  switch (props.size) {
    case "large":
      // use sparingly
      return <Typography variant="body1" {...props} />
    case "small":
      // recommended
      return <Typography variant="body2" {...props} />
  }
  // recommended
  return <Typography variant="body1" {...props} />
}

export function Label(props: TypographyProps) {
  // recommended
  return <Typography variant="caption" {...props} />
}

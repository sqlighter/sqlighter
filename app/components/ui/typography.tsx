//
// typography.tsx - simplified typography choices styled after material 3 specs
//

// Material Design 3, Typography Overview
// https://m3.material.io/styles/typography/overview

// Fonts
// https://m3.material.io/styles/typography/fonts

// Type scale and tokens
// https://m3.material.io/styles/typography/type-scale-tokens

// Applying type
// https://m3.material.io/styles/typography/applying-type

import { Theme, SxProps } from "@mui/material/styles"
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from "@mui/material"

export interface TypographyProps extends MuiTypographyProps {
  /** Class name to be applied to this element's root (optional) */
  className?: string

  /** Style when using generic component, default to body */
  typescale?: "display" | "headline" | "title" | "body" | "label"

  /** Relative size, defaults to medium */
  size?: "small" | "medium" | "large"
}

function Typography(props: TypographyProps) {
  const size = props.size || "medium"
  const typescale = props.typescale || "body"
  let className = `Typography-root Typography-${typescale}${size.charAt(0).toUpperCase()}${size.slice(1)}`
  if (props.className) {
    className += " " + props.className
  }
  return <MuiTypography className={className}>{props.children}</MuiTypography>
}

export function Display(props: TypographyProps) {
  return <Typography typescale="display" {...props} />
}

export function Headline(props: TypographyProps) {
  return <Typography typescale="headline" {...props} />
}

export function Title(props: TypographyProps) {
  return <Typography typescale="title" {...props} />
}

export function Body(props: TypographyProps) {
  return <Typography typescale="body" {...props} />
}

export function Label(props: TypographyProps) {
  return <Typography typescale="label" {...props} />
}

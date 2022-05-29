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

import { Typography as MuiTypography, Typography, TypographyProps as MuiTypographyProps } from "@mui/material"

export interface TypographyProps extends MuiTypographyProps {
  /** Relative size, defaults to medium */
  size?: "small" | "medium" | "large"
}

export function Display(props: TypographyProps) {
  const size = props.size || "medium"
  return <Typography className={`Display-${size}`}>{props.children}</Typography>
}

export function Headline(props: TypographyProps) {
  const size = props.size || "medium"
  return <Typography className={`Headline-${size}`}>{props.children}</Typography>
}

export function Title(props: TypographyProps) {
  const size = props.size || "medium"
  return <Typography className={`Title-${size}`}>{props.children}</Typography>
}

export function Body(props: TypographyProps) {
  const size = props.size || "medium"
  return <Typography className={`Body-${size}`}>{props.children}</Typography>
}

export function Label(props: TypographyProps) {
  const size = props.size || "medium"
  return <Typography className={`Label-${size}`}>{props.children}</Typography>
}

//
// logo.tsx - shows the logo of an organization in the given space
//

import Image from "next/image"
import useSWR from "swr"
import Box from "@mui/material/Box"

interface LogoProps {
  organizationId: string
  width: number
  height: number

  // https://developer.mozilla.org/en-US/docs/Web/CSS/object-position
  objectPosition?: string
}

/** Shows the logo of an organization in a given box */
export function Logo({ organizationId, width, height, objectPosition }: LogoProps) {
  const { data } = useSWR(`/api/organizations/${organizationId}`, (apiUrl: string) =>
    fetch(apiUrl).then((res) => res.json())
  )

  // TODO could pick the image with the aspect ratio that fills the target container best
  // https://nextjs.org/docs/api-reference/next/image#layout
  const organization = data?.data
  const image = organization?.images?.[0]

  return (
    <Box height={height} width={width}>
      {image && (
        <Image
          src={image.url}
          alt={organization.title}
          width={width}
          height={height}
          layout="intrinsic"
          objectFit="contain"
          objectPosition={objectPosition || "left center"}
        />
      )}
    </Box>
  )
}

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
}

/** Shows the logo of an organization in a given box */
export function Logo({ organizationId, width, height }: LogoProps) {
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
        />
      )}
    </Box>
  )
}

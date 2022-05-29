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

function getBestFitImage(images, width, height) {
  let bestFit = 0
  let bestImage = null

  const aspectRatio = width / height

  for (const image of images) {
    const imageRatio = image.width / image.height
    const imageFit = aspectRatio > imageRatio ? height * (image.height / height) : width * (image.width / width)

    if (imageFit > bestFit) {
      bestImage = image
    }
  }

  return bestImage
}

/** Shows the logo of an organization in a given box */
export function Logo({ organizationId, width, height, objectPosition }: LogoProps) {
  const { data } = useSWR(`/api/organizations/${organizationId}`, (apiUrl: string) =>
    fetch(apiUrl).then((res) => res.json())
  )

  // TODO could pick the image with the aspect ratio that fills the target container best
  // https://nextjs.org/docs/api-reference/next/image#layout
  const organization = data?.data

  if (organization?.images?.[0]) {
    const image = getBestFitImage(organization.images, width, height)

    return (
      <Box height={height} width={width}>
        <Image
          src={image.url}
          alt={organization.title}
          width={width}
          height={height}
          layout="intrinsic"
          objectFit="contain"
          objectPosition={objectPosition || "left center"}
        />
      </Box>
    )
  }

  // empty box for now
  return <Box width={width} height={height}></Box>
}

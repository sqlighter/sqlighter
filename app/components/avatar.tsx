import React, { useContext } from "react"
import Image from "next/image"

import { Context } from "./context"
import { useUser } from "../lib/auth/hooks"


export default function Avatar(props) {
  const [user] = useUser()

  const context = useContext(Context)

  const displayName = user?.attributes?.passport?.displayName
  const imageUrl = user?.attributes?.passport?.photos?.[0].value

  return (
    <>
      avatar context: {JSON.stringify(context)}
      <p />
      avatar user: {JSON.stringify(user)}
      <p />
      avatar props: {JSON.stringify(props)}
      <p />
      {
        // eslint-disable-next-line @next/next/no-img-element
        imageUrl && <img src={imageUrl} width={50} height={50} alt={displayName} />
      }
    </>
  )
}

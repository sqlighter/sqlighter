import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import utilStyles from "../styles/utils.module.css"

import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"

import { useUser } from "../lib/auth/hooks"
import { getSortedPostsData } from "../lib/posts"
import { Context } from "../components/context"
import Layout from "../components/layout"
import Date from "../components/date"
import { Typography } from "@mui/material"

interface ProfilePageProps {
  //
}

function SignedinProfile() {}

export default function ProfilePage(props: ProfilePageProps) {
  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()

  const context = React.useContext(Context)

  if (userLoading) {
    return <>Loading...</>
  }

  if (!user) {
    const google = (window as any).google
    google.accounts.id.renderButton(
      document.getElementById("googleSigninButton"),
      { theme: "outline", size: "large", shape: "pill" } // customization attributes
    )

    return (
      <Layout title="Profile">
        <section>
          <div id="googleSigninButton"></div>
        </section>
      </Layout>
    )
  }

  function onSignout(event) {
    context.signout("/browse")
  }

  const email = context.user?.id
  const displayName = context.user?.attributes?.passport?.displayName || ""
  const imageUrl = context.user?.attributes?.passport?.photos?.[0]?.value

  return (
    <Layout title="Profile">
      <section>
        <h2 className={utilStyles.headingLg}>Profile</h2>

        <Stack direction="row" spacing={2}>
          <Tooltip title={displayName}>
            <Avatar alt={displayName} src={imageUrl} sx={{ width: 96, height: 96 }} />
          </Tooltip>
          <Stack direction="column">
            <Typography variant="h4">{displayName}</Typography>
            <Typography variant="body2">{email}</Typography>
            <Button onClick={onSignout} variant="outlined">
              Signout
            </Button>
          </Stack>
        </Stack>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      //
    },
  }
}

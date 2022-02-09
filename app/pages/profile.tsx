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
import { Context } from "../components/context"
import Layout from "../components/layout"
import { Typography } from "@mui/material"

import { SigninPanel } from "../components/signin"

interface ProfilePageProps {
  //
}

function getProfileContents(context) {
  const user = context.user
  const email = user?.id
  const displayName = user?.attributes?.passport?.displayName || ""
  const imageUrl = user?.attributes?.passport?.photos?.[0]?.value

  function onSignout(event) {
    context.signout("/browse")
  }

  return (
    <section>
      <h2 className={utilStyles.headingLg}>Profile (with)</h2>

      <Stack direction="row" spacing={2}>
        <Tooltip title={displayName}>
          <Avatar alt={displayName} src={imageUrl} sx={{ width: 96, height: 96 }} />
        </Tooltip>
        <Stack direction="column">
          <Typography variant="h4">{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <Box mt={4}>
            <Button onClick={onSignout} variant="outlined">
              Signout
            </Button>
          </Box>
        </Stack>
      </Stack>
    </section>
  )
}

export default function ProfilePage(props: ProfilePageProps) {
  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()

  const context = React.useContext(Context)

  // avoid flashing while user is loading
  if (userLoading) return null

  if (!context.user)
    return (
      <Layout title="Profile">
        <SigninPanel />
      </Layout>
    )

  return <Layout title="Profile">{getProfileContents(context)}</Layout>
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      //
    },
  }
}

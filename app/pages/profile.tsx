import { GetStaticProps } from "next"
import Head from "next/head"
//import Link from "next/link"

import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Icon from "@mui/material/Icon"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import MenuItem from "@mui/material/MenuItem"
import InputAdornment from "@mui/material/InputAdornment"

import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import Layout from "../components/layout"
import { Typography } from "@mui/material"

import { SigninPanel } from "../components/signin"

const sexes = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

interface ProfilePageProps {
  //
}

function getProfileContents(context) {
  const user = context.user
  const email = user?.id
  const displayName = user?.attributes?.passport?.displayName || ""
  const imageUrl = user?.attributes?.passport?.photos?.[0]?.value

  function onSignout(event) {
    context.signout("/library")
  }

  return (
    <section>
      <Stack direction="row" spacing={2}>
        <Tooltip title={displayName}>
          <Avatar alt={displayName} src={imageUrl} sx={{ width: 96, height: 96 }} />
        </Tooltip>
        <Stack direction="column">
          <Box mt={2} mb={6}>
            <Typography variant="h4">{displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <TextField id="birthday-field" label="Birthday" variant="outlined" sx={{ marginBottom: 2 }} />

          <TextField id="sex-field" label="Sex" variant="outlined" select sx={{ marginBottom: 2 }}>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>

          <TextField
            id="height-field"
            label="Height"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="start">cm</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            id="weight-field"
            label="Weight"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="start">kg</InputAdornment>,
            }}
            sx={{ marginBottom: 2 }}
          />

          <Link>Why we ask?</Link>
        </Stack>
      </Stack>
    </section>
  )
}

/*
          <Box mt={4}>
            <Button onClick={onSignout} variant="outlined">
              Signout
            </Button>
          </Box>

          */

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

  //  const email = user?.id
  //  const displayName = user?.attributes?.passport?.displayName || ""
  //  const imageUrl = user?.attributes?.passport?.photos?.[0]?.value

  return (
    <Layout title="Profile" subtitle="Personalize your results">
      {getProfileContents(context)}
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

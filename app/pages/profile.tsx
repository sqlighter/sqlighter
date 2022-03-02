//
// profile.tsx - showns profile page, basic account info
//

import * as React from "react"
import dayjs from "dayjs"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import { useUser } from "../lib/auth/hooks"
import { Context } from "../components/context"
import Layout from "../components/layout"
import { Section } from "../components/section"
import { SigninPanel } from "../components/signin"
import { Tip } from "../components/tip"
import { DateInput, SelectInput, NumericInput } from "../components/inputs"

interface ProfilePageProps {
  //
}

function ProfilePanel({ user }) {
  const email = user.id
  const displayName = user.attributes?.passport?.displayName || ""
  const imageUrl = user.attributes?.passport?.photos?.[0]?.value
  const profile = user.attributes?.profile

  function handleBirthdate(date) {
    if (date) {
      let formatted = dayjs(date).format("YYYY-MM-DD")
      console.log("handleBirthdate: %s, valid?", formatted, date.isValid(), date)
    } else {
      console.log("handleBirthdate - null")
    }
  }

  function handleGender(gender) {
    console.log("handleGender: %s", gender)
  }

  function handleHeight(height) {
    console.log("handleHeight: %s", height)
  }

  function handleWeight(weight) {
    console.log("handleWeight: %s", weight)
  }

  // fields are fu
  const fieldSx = { width: "100%", maxWidth: 400, marginBottom: 4 }

  return (
    user && (
      <>
        <Stack direction="row" spacing={2} mb={2}>
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
          </Stack>
        </Stack>

        <Section title="Personal Information">
          <Box mb={2}>
            <Tip title="Why do we ask?" variant="link">
              <Box mt={1} mb={1}>
                We use information like gender and age to give you the optimal ranges for a number of biomarkers like
                cholesterol. Please pick the gender that fits you best hormonally as that will give you the best
                results. Your privacy is important to us. Your selections remain private and you can remove any data at
                any time. See our <a href="/privacy">Privacy Policy</a> for more information.
              </Box>
            </Tip>
          </Box>

          <DateInput
            id="birthdate-field"
            label="Birthdate"
            value={profile?.birthdate}
            onChange={handleBirthdate}
            minDate={dayjs().add(-100, "year")}
            sx={fieldSx}
          />

          <SelectInput id="gender-field" label="Gender" value={profile?.gender} onChange={handleGender} sx={fieldSx}>
            <MenuItem value="">&nbsp;</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </SelectInput>

          <NumericInput
            id="height-field"
            label="Height"
            unit="cm"
            value={profile?.height}
            onChange={handleHeight}
            sx={fieldSx}
          />

          <NumericInput
            id="weight-field"
            label="Weight"
            unit="kg"
            value={profile?.weight}
            onChange={handleWeight}
            sx={fieldSx}
          />
        </Section>
      </>
    )
  )
}

export default function ProfilePage(props: ProfilePageProps) {
  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading }] = useUser()

  const context = React.useContext(Context)

  // avoid flashing while user is loading
  if (userLoading) return null

  return (
    <Layout title="Profile" subtitle="Personalize your results">
      {context.user ? <ProfilePanel user={context.user} /> : <SigninPanel />}
    </Layout>
  )
}

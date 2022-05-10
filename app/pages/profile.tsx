//
// profile.tsx - showns profile page, basic account info
//

import * as React from "react"
import { useState } from "react"
import dayjs from "dayjs"

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import { deepmerge } from "@mui/utils"

import { useUser } from "../lib/auth/hooks"
import { AppLayout } from "../components/layouts"
import { Section } from "../components/section"
import { SigninPanel } from "../components/signin"
import { Tip } from "../components/tip"
import { DateInput, SelectInput, NumericInput } from "../components/inputs"

interface ProfilePageProps {
  //
}

function ProfilePanel() {
  // retrieve user information from current session
  const [user, { mutate: mutateUser, loading: userLoading, setUser }] = useUser()

  // user's customized profile (not the passport used for identity)
  const [profile, setProfile] = useState(user?.profile || {})

  if (!user) return null

  const email = user.id
  const displayName = user.passport?.displayName || ""
  const imageUrl = user.passport?.photos?.[0]?.value

  async function updateProfile(profile) {
    setProfile(profile)

    // update user in database
    const updated = deepmerge(user, { profile })
    await setUser(updated)
  }

  async function updateBirthdate(date) {
    let birthdate = null
    if (date.isValid()) {
      birthdate = dayjs(date).format("YYYY-MM-DD")
    }
    await updateProfile({ ...profile, birthdate })
  }

  // fields are fullWidth with a limit
  const fieldSx = { width: "100%", maxWidth: 400, marginBottom: 4 }

  return (
    <>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Tooltip title={displayName}>
          <Avatar alt={displayName} src={imageUrl} sx={{ width: 96, height: 96 }} />
        </Tooltip>
        <Stack direction="column">
          <Typography variant="h4">{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Stack>
      </Stack>

      <Section title="Personal Information">
        <Box mb={2}>
          <Tip title="Why do we ask?" variant="link">
            <Box mt={1} mb={1}>
              We use information like gender and age to give you the optimal ranges for a number of biomarkers like
              cholesterol. Please pick the gender that fits you best hormonally as that will give you the best results.
              Your privacy is important to us. Your selections remain private and you can remove any data at any time.
              See our <a href="/privacy">Privacy Policy</a> for more information.
            </Box>
          </Tip>
        </Box>

        <DateInput
          id="birthdate-field"
          label="Birthdate"
          value={profile?.birthdate ? dayjs(profile.birthdate, "YYYY-MM-DD") : undefined}
          onChange={updateBirthdate}
          minDate={dayjs().add(-100, "year")}
          sx={fieldSx}
        />

        <SelectInput
          id="gender-field"
          label="Gender"
          value={profile?.gender ? profile.gender : ""}
          onChange={async (gender) => await updateProfile({ ...profile, gender })}
          sx={fieldSx}
        >
          <MenuItem value="">&nbsp;</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </SelectInput>

        <NumericInput
          id="height-field"
          label="Height"
          unit="cm"
          value={profile?.height}
          onChange={async (height) => await updateProfile({ ...profile, height })}
          sx={fieldSx}
        />

        <NumericInput
          id="weight-field"
          label="Weight"
          unit="kg"
          value={profile?.weight}
          onChange={(weight) => updateProfile({ ...profile, weight })}
          sx={fieldSx}
        />
      </Section>
    </>
  )
}

export default function ProfilePage(props: ProfilePageProps) {
  // retrieve user information from current session
  const [user, { loading: userLoading }] = useUser()

  // avoid flashing while user is loading
  if (userLoading) return null

  return (
    <AppLayout title="Profile" description="Personalize your results">
      {user ? <ProfilePanel /> : <SigninPanel />}
    </AppLayout>
  )
}

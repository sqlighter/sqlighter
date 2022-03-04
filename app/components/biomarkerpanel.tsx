//
// biomarkerpanel.tsx - panel that shows biomarkers latest reading, allows input, shows charted recap, etc
//

import Box from "@mui/material/Box"

import { Biomarker } from "../lib/items/biomarkers";


import useSWR from "swr"
import { fetcher, putJson } from "../lib/api"

/** Retrieve information on currently logged in user */
export function useUser() {
  const { data, mutate } = useSWR("/api/user", fetcher)

  // if data is not defined, the query has not completed
  const loading = !data
  const user = data?.data

  /**
   * Callback used to post updated user information. Only the profile
   * attributes of the user item can be updated via this API. Other
   * parts of the user, like OpenId passport information cannot be updated.
   */
  async function setUser(user) {
    const response = await putJson("/api/user", user)
    // update the local data immediately, but disable the revalidation
    mutate(response, false)
  }

  return [user, { mutate, loading, setUser }]
}






interface BiomarkerPanelProps {

  item: Biomarker

  variant?: "default"
}

export function BiomarkerPanel({item, variant}: BiomarkerPanelProps) {

  console.log(item)

  return <Box width="100%">
    Biomarker: {item.id} panel
  </Box>
}



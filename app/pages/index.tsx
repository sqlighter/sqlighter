//
// index.tsx - home page
//

import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { SiteLayout } from "../components/layouts"
import { Empty } from "../components/empty"
import homeImage from "../public/images/empty1.jpg"

export default function Home({ props }) {
  return (
    <SiteLayout description="Know better, live better" home>
      <Empty title="Biomarkers.app" description="Know better, live better" image={homeImage} />
      <Stack alignItems="center" justifyContent="center" mt={4}>
        <Link
          variant="subtitle2"
          href="mailto:info@biomarkers.app"
          underline="hover"
          sx={{ cursor: "pointer", position: "absolute", bottom: 32 }}
        >
          info@biomarkers.app
        </Link>
      </Stack>
    </SiteLayout>
  )
}

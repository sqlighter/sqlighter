//
// index.tsx - home page
//

import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"

import { SiteLayout } from "../components/layouts"
import { Empty } from "../components/empty"
import homeImage from "../public/images/empty1.jpg"

export default function Home({ props }) {
  return (
    <SiteLayout description="Know better, live better">
      <Empty title="Biomarkers.app" description="Know better, live better" image={homeImage} />
      <Stack alignItems="center" justifyContent="center" mt={4}>
        <Link
          variant="subtitle2"
          href="mailto:info@biomarkers.app"
          underline="hover"
          sx={{
            cursor: "pointer",
            position: "absolute",
            bottom: 32,
            "@media (max-height: 480px)": {
              visibility: "hidden",
            },
          }}
        >
          info@biomarkers.app
        </Link>
      </Stack>
    </SiteLayout>
  )
}

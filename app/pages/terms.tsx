//
// terms.tsx - terms of service page
//

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Area } from "../components/onepage/area"
import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Section } from "../components/ui/section"

export default function TermsOfServicePage() {
  return (
    <OnePageLayout title="Terms of Service" maxWidth="sm">
      <Area maxWidth="sm">
        <Section title="Terms of Service" description="100% Open Source" variant="large">
          <Box sx={{ paddingBottom: 4 }}>
            <Typography variant="subtitle1" pt={2}>
              MIT License
            </Typography>
            <Typography variant="body2">
              The software is provided "as is", without any warrany of any kind, express or implied, including but not
              limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no
              event shall the authors or copyright holders be liable for any claim, damages or other liability, whether
              in an action of contract, tort or otherwise, arising from, out of or in connection with the software or
              the use or other dealings in the software.
            </Typography>
          </Box>
        </Section>
      </Area>
    </OnePageLayout>
  )
}

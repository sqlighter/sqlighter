//
// privacy.tsx - privacy policy page
//

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"

import { Area } from "../components/onepage/area"
import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Section } from "../components/ui/section"

export default function PrivacyPolicyPage() {
  return (
    <OnePageLayout title="Privacy Policy" maxWidth="sm">
      <Area maxWidth="sm">
        <Section title="Privacy Policy" description="We respect your privacy" variant="large">
          <Box sx={{ paddingBottom: 4 }}>
            <Typography variant="subtitle1" pt={2}>
              Information we collect
            </Typography>
            <Typography variant="body2">
              Your privacy is important to us. It is our policy to respect your privacy and comply with any applicable
              law and regulation regarding any personal information we may collect about you. Information we collect
              includes both information you knowingly and actively provide us when using or participating in our
              service, and any information automatically sent by your devices in the course of accessing our services.
              We use Google Analytics to view aggregate, anonimized, information about our services usage.
            </Typography>
            <Typography variant="subtitle1" pt={2}>
              Personal information
            </Typography>
            <Typography variant="body2">
              We may ask for personal information like name, email, etc. We only collect and use your personal
              information when we have a legitimate reason for doing so, for example to enable signing in and to storing
              your bookmarks. In this instance, we only collect personal information that is reasonably necessary to
              provide our services so that we can customise or personalise your experience of our service. We never
              resell or make your information available to any third parties for commercial reasons.
            </Typography>
            <Typography variant="subtitle1" pt={2}>
              Security of your personal information
            </Typography>
            <Typography variant="body2">
              When we collect and process personal information, and while we retain this information, we will protect it
              within commercially acceptable means to prevent loss and theft, as well as unauthorized access,
              disclosure, copying, use, or modification. For any questions or concerns regarding your privacy, please{" "}
              <Link href="mailto:privacy@sqlighter.com?subject=Privacy Policy" underline="hover">
                contact us
              </Link>
              .
            </Typography>
          </Box>
        </Section>
      </Area>
    </OnePageLayout>
  )
}

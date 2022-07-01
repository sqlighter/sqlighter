//
// privacy.tsx - privacy policy page
//

import { OnePageLayout } from "../components/onepage/onepagelayout"

export default function PrivacyPolicyPage() {
  return (
    <OnePageLayout title="Privacy Policy" description="We respect your privacy">
      <h4>Information We Collect</h4>
      <p>
        Your privacy is important to us. It is SQLighter&#39;s policy to respect your privacy and comply with any
        applicable law and regulation regarding any personal information we may collect about you. Information we
        collect includes both information you knowingly and actively provide us when using or participating in any of
        our services, and any information automatically sent by your devices in the course of accessing our services.
      </p>
      <h4>Personal Information</h4>
      <p>
        We may ask for personal information which may include one or more of the following: Name, email, etc. We only
        collect and use your personal information when we have a legitimate reason for doing so. In which instance, we
        only collect personal information that is reasonably necessary to provide our services so that we can customise
        or personalise your experience of our website.
      </p>
      <h4>Security of Your Personal Information</h4>
      <p>
        When we collect and process personal information, and while we retain this information, we will protect it
        within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure,
        copying, use, or modification.
      </p>
      <h4>Contact Us</h4>
      <p>
        For any questions or concerns regarding your privacy, you may contact us using the following details:
        <a href="mailto:privacy@sqlighter.com">privacy@sqlighter.com</a>.
      </p>
    </OnePageLayout>
  )
}

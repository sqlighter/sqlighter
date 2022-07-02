//
// oneage/faq.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Area } from "../components/onepage/area"
import { Faq } from "../components/onepage/faq"

export default {
  title: "OnePage/Faq",
  component: Faq,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "FAQs",
    faqs: [
      {
        title: "How does Gmail keep my email communications secure and private?",
        description:
          "Gmail has always had strong security as a foundation. We work hard to protect you from spam, phishing, and malware, before they reach your inbox. Our AI-enhanced spam-filtering capabilities block nearly 10 million spam emails every minute.",
      },
      {
        title: "Do you use my email for ads?",
        description:
          "No. While you may see ads in your no-cost Gmail account, your emails are private. Google does not scan or process Gmail content for advertising purposes.",
      },
      {
        title: "How can I keep my emails even more safe and secure?",
        description:
          "While Gmail’s features are secure enough for most users, some accounts may require additional layers of safety. Google's Advanced Protection Program safeguards users with high visibility and sensitive information, who are at risk of targeted online attacks.",
        link: "https://landing.google.com/advancedprotection/",
      },
      {
        title: "What if I want to use Gmail for work or my business?",
        description:
          "Gmail is part of Google Workspace where you can choose from different plans. In addition to what you love about Gmail, you get a custom email address (@yourcompany.com), unlimited group email addresses, 99.9% guaranteed uptime, twice the storage of personal Gmail, zero ads, 24/7 support, Google Workspace Sync for Microsoft Outlook, and more.",
        link: "https://workspace.google.com/?utm_source=gmailforwork&utm_medium=et&utm_campaign=body&utm_content=learnmore",
      },
    ],
  },
} as ComponentMeta<typeof Faq>

const Template: ComponentStory<typeof Faq> = (args) => (
  <Area background="gray">
    <Faq {...args} />
  </Area>
)

export const Primary = Template.bind({})

export const WithLongTitle = Template.bind({})
WithLongTitle.args = {
  title: "Find the answers you need"
}

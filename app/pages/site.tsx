//
// index.tsx - one pager site
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"

import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Area } from "../components/onepage/area"
import { TabSet } from "../components/onepage/tabset"
import { Touts } from "../components/onepage/touts"
import { Faq } from "../components/onepage/faq"
import { Chapter } from "../components/onepage/chapter"
import { TryButton } from "../components/onepage/trybutton"
import { ContributeButton } from "../components/onepage/contributebutton"

const Site_SxProps: SxProps<Theme> = {
  // theme color for background
  // backgroundColor: (theme: any) => alpha(theme.palette.primary.lightest, 0.40),

  ".Site-hero": {
    ".Chapter-icon": {
      marginLeft: "-10px",
    },
  },
}

export default function SitePage() {
  return (
    <OnePageLayout description="lighter, faster" actions={<TryButton />}>
      <Box className="Site-root" sx={Site_SxProps}>
        <Chapter
          className="Site-hero"
          icon="/branding/mark-primary.png"
          title="Secure, smart, and easy to use email"
          description="Get more done with Gmail. Now integrated with Google Chat, Google Meet, and more, all in one place."
          buttons={<TryButton variant="contained" />}
          image="/site/hero.webp"
          variant="left"
          size="large"
        />
        <Area background="gray">
          <TabSet
            title="Email that's secure, private, and puts you in control"
            tabs={[
              {
                title: "We never use your Gmail content for any ads purposes",
                description:
                  "Gmail uses industry-leading encryption for all messages you receive and send. We never use your Gmail content to personalize ads.",
                image: "/site/carousel-1-1.webp",
              },
              {
                title: "Gmail keeps over a billion people safe every day",
                description: "Gmail blocks 99.9% of spam, malware, and dangerous links from ever reaching your inbox.",
                image: "/site/carousel-1-2.webp",
              },
              {
                title: "The most advanced phishing protections available",
                description:
                  "When a suspicious email arrives that could be legitimate, Gmail lets you know, keeping you in control",
                image: "/site/carousel-1-2.webp",
              },
              {
                title: "Best-in-class controls over emails you send",
                description:
                  "Confidential Mode lets you set expirations and require recipients to verify by text. You can also remove options to forward, copy, download and print.",
                image: "/site/carousel-1-4.webp",
              },
            ]}
          />
        </Area>
        <Area>
          <TabSet
            variant="right"
            title="Get more done with Gmail"
            tabs={[
              {
                title: "Stay connected and get organized",
                description:
                  "Start a Chat, jump into a video call with Meet, or collaborate in a Doc, all right from Gmail.",
                image: "/site/carousel-2-1.webp",
              },
              {
                title: "Get more done faster",
                description:
                  "Write emails and messages faster with features like Smart Compose to spend more time doing what you love",
                image: "/site/carousel-2-2.webp",
              },
              {
                title: "Never forget to reply",
                description: "Gentle nudges help you stay on top of everything",
                image: "/site/carousel-2-2.webp",
              },
            ]}
          />
        </Area>
        <Area background="gray">
          <Touts
            features={[
              {
                title: "Works with other tools",
                description:
                  "Gmail works great with desktop clients like Microsoft Outlook, Apple Mail and Mozilla Thunderbird, including contact and event sync.",
                icon: "check",
              },
              {
                title: "Stay productive, even offline",
                description:
                  "Gmail offline lets you read, reply, delete, and search your Gmail messages when you???re not connected to the internet.",
                icon: "wifioff",
              },
              {
                title: "Experience Gmail on any device",
                description: "Enjoy the ease and simplicity of Gmail, wherever you are.",
                icon: "devices",
              },
            ]}
          />
        </Area>
        <Chapter
          icon="/site/family.svg"
          title="100% Open Source"
          description="Collaborate faster, from any device, anytime, all in one place."
          text="Google Workspace is a set of productivity and collaboration tools that helps individuals, teams, and businesses stay on top of everything. It is a flexible, innovative solution that includes all your favorite apps like Gmail, Calendar, Drive, Docs, Meet, and more."
          buttons={<ContributeButton />}
          variant="center"
        />
        <Area background="gray">
          <Faq
            title="FAQs"
            faqs={[
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
                  "While Gmail???s features are secure enough for most users, some accounts may require additional layers of safety. Google's Advanced Protection Program safeguards users with high visibility and sensitive information, who are at risk of targeted online attacks.",
                link: "https://landing.google.com/advancedprotection/",
              },
              {
                title: "What if I want to use Gmail for work or my business?",
                description:
                  "Gmail is part of Google Workspace where you can choose from different plans. In addition to what you love about Gmail, you get a custom email address (@yourcompany.com), unlimited group email addresses, 99.9% guaranteed uptime, twice the storage of personal Gmail, zero ads, 24/7 support, Google Workspace Sync for Microsoft Outlook, and more.",
                link: "https://workspace.google.com/?utm_source=gmailforwork&utm_medium=et&utm_campaign=body&utm_content=learnmore",
              },
            ]}
          />
        </Area>
        <Chapter
          icon="/branding/mark-primary.png"
          title="Show the world how it???s done"
          description="Get started with a more powerful tool today"
          image="/site/closing.webp"
          buttons={<TryButton />}
          variant="center"
        />
      </Box>
    </OnePageLayout>
  )
}

//
// index.tsx - one pager site
//

import Image from "next/image"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

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
  const openSourceProjects = (
    <Stack direction="row" spacing={3} alignItems="center">
      <a href="https://nextjs.org/" target="_blank">
        <img src="/logos/nextjs.svg" height={44} title="Next.js" />
      </a>
      <a href="https://mui.com/" target="_blank">
        <img src="/logos/mui.svg" height={36} title="Material UI" />
      </a>
      <a href="https://sql.js.org/" target="_blank">
        <img src="/logos/sqljs.png" height={36} title="SQL.js" />
      </a>
      <a href="https://reactjs.org/" target="_blank">
        <img src="/logos/react.svg" height={36} title="React" />
      </a>
      <a href="https://www.sqlite.org/" target="_blank">
        <img src="/logos/sqlite.gif" height={36} title="SQLite" />
      </a>
    </Stack>
  )

  return (
    <OnePageLayout description="lighter, faster" actions={<TryButton />}>
      <Box className="Site-root" sx={Site_SxProps}>
        <Chapter
          className="Site-hero"
          icon="/branding/mark-primary.png"
          title="SQLite comes alive, right in your browser"
          description="Open your database or create one, edit, import, export, run your queries, learn SQL and more. All within your browser with no downloads needed."
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
                  "Run a query and export your data to Excel or csv. SQLighter works great with other desktop clients and tools.",
                icon: "check",
              },
              {
                title: "Stay productive, even offline",
                description:
                  "Your queries run locally and your data never leaves the page. SQLighter works even when you’re not connected to the internet.",
                icon: "wifioff",
              },
              {
                title: "Experience on any device",
                description:
                  "Development tools give their best on desktops but you can run SQLighter on devices and tablets as well.",
                icon: "devices",
              },
            ]}
          />
        </Area>
        <Chapter
          icon={openSourceProjects}
          title="100% Open Source"
          description="Built on many popular open source projects"
          text="We owe to a rich collection of projects built by a dedicated community of thousands of contibutors. SQLighter embraces open source with a full MIT license and we welcome your contributions. Get in touch for comments, feature requests, pull requests, suggestions, etc."
          buttons={<ContributeButton />}
          variant="center"
        />
        <Area background="gray">
          <Faq
            title="FAQs"
            faqs={[
              {
                title: "How do you keep my data secure and private?",
                description:
                  "SQLighter opens your database right in your browser. When you run a query, it runs right in the page with no server components and no need to move your data anywhere. Your data never leaves your desk unless you want to.",
              },
              {
                title: "What if I want to use SQLighter for work or my business?",
                description:
                  "SQLighter is free for any use and fully MIT licensed. If you'd like to support our work, please add a star to our Github project or become a sponsor, thanks!",
              },
              {
                title: "Do you use my email for ads?",
                description:
                  "No. If you signin with your email, we use your email to store bookmarks and customize your experience. Your email or other data is never sold or transferred, see our Privacy Policy.",
                link: "https://sqlighter.com/privacy",
              },
            ]}
          />
        </Area>
        <Chapter
          icon="/branding/mark-primary.png"
          title="Show the world how it’s done"
          description="Get started with a more powerful tool today"
          image="/site/closing.webp"
          buttons={<TryButton />}
          variant="center"
        />
      </Box>
    </OnePageLayout>
  )
}

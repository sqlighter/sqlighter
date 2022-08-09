//
// site.tsx - one pager site
//

import Image from "next/image"
import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import GitHubButton from "react-github-btn"
import Slide from "@mui/material/Slide"

import showYourLove from "../public/site/showyourlove.png"
import { useWideScreen } from "../components/hooks/usewidescreen"
import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Area } from "../components/onepage/area"
import { TabSet } from "../components/onepage/tabset"
import { Touts } from "../components/onepage/touts"
import { Faq } from "../components/onepage/faq"
import { Chapter } from "../components/onepage/chapter"
import { TryButton } from "../components/onepage/trybutton"
import { ContributeButton } from "../components/onepage/contributebutton"

import carousel11 from "../public/site/carousel-1-1.png"
import carousel12 from "../public/site/carousel-1-2.png"
import carousel13 from "../public/site/carousel-1-3.png"
import carousel14 from "../public/site/carousel-1-4.png"
import carousel21 from "../public/site/carousel-2-1.png"
import carousel22 from "../public/site/carousel-2-2.png"
import carousel23 from "../public/site/carousel-2-3.png"

import logoSqlite from "../public/logos/sqlite.svg"
import logoMui from "../public/logos/mui.svg"
import logoSqljs from "../public/logos/sqljs.png"
import logoReact from "../public/logos/react.svg"
import logoNextjs from "../public/logos/nextjs.svg"

import markPrimary from "../public/branding/mark-primary.png"

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
  // show your love button with github stars shown only where there's enough space and page scrolled at top
  const isScrolled = useScrollTrigger({ disableHysteresis: true, threshold: 100 })
  const [isWideScreen] = useWideScreen("sm")

  const openSourceProjects = (
    <Stack direction="row" spacing={3} alignItems="center">
      <a href="https://www.sqlite.org/" target="_blank">
        <Image src={logoSqlite} alt="SQLite" height={36} width={72} objectFit="contain" />
      </a>
      <a href="https://mui.com/" target="_blank">
        <Image src={logoMui} height={36} width={36} objectFit="contain" alt="Material UI" />
      </a>
      <a href="https://sql.js.org/" target="_blank">
        <Image src={logoSqljs} height={36} width={36} objectFit="contain" alt="SQL.js" />
      </a>
      <a href="https://reactjs.org/" target="_blank">
        <Image src={logoReact} height={36} width={36} objectFit="contain" alt="React" />
      </a>
      <a href="https://nextjs.org/" target="_blank">
        <Image src={logoNextjs} height={44} width={72} objectFit="contain" alt="Next.js" />
      </a>
    </Stack>
  )

  let actions = <TryButton height={50} />
  if (isWideScreen) {
    actions = (
      <>
        <Slide direction="down" in={!isScrolled}>
          <Box sx={{ position: "relative", width: 120, minWidth: 120, top: 20, left: 32 }}>
            <Image src={showYourLove} alt="Star SQLighter on GitHub" />
          </Box>
        </Slide>
        <Slide direction="down" in={!isScrolled && isWideScreen}>
          <Box sx={{ width: 88, mt: 1, mr: 2, display: "flex", alignItems: "center" }}>
            <GitHubButton
              href="https://github.com/sqlighter/sqlighter"
              data-show-count="true"
              aria-label="Star on GitHub"
            >
              Star
            </GitHubButton>
          </Box>
        </Slide>
        {actions}
      </>
    )
  }

  return (
    <OnePageLayout description="lighter, faster" actions={actions}>
      <Box className="Site-root" sx={Site_SxProps}>
        <Chapter
          className="Site-hero"
          icon={<Image src={markPrimary} width={80} height={80} alt="SQLighter" />}
          title={"SQLite comes alive in your browser"}
          description="Open your database or create one, import data, run your queries, share results, learn SQL and more... All within your browser. No downloads required."
          buttons={<TryButton variant="contained" />}
          image="/site/hero.png"
          variant="left"
          size="large"
        />
        <Area background="gray">
          <TabSet
            title="A database explorer that's secure, private, and easy to use"
            tabs={[
              {
                title: "Data viewer and editor",
                description:
                  "Drag and drop any SQLite database on the page to see its data. That's all it takes, really. You can filter your data and run custom queries on your results.",
                image: <Image src={carousel11} alt="Data viewer and editor" />,
              },
              {
                title: "Tab based interface",
                description:
                  "Open lots of tabs and work on multiple queries at once without changing windows. Table definitions, query results, schemas each have their own tabs.",
                image: <Image src={carousel12} alt="Tab based interface" />,
              },
              {
                title: "Modern SQL editor",
                description:
                  "IntelliSense provides smart code completions for your queries with syntax highlighting and validation. Type faster with fewer mistakes. Pretty print on demand.",
                image: <Image src={carousel13} alt="Modern SQL editor" />,
              },
              {
                title: "Save queries and results",
                description:
                  "Bookmark your queries in your user profile and access them anywhere from multiple computers. Access a query's history to see all its versions and modifications.",
                image: <Image src={carousel14} alt="Save queries and results" />,
              },
            ]}
          />
        </Area>
        <Area>
          <TabSet
            variant="right"
            title="Get more done with SQLighter"
            tabs={[
              {
                title: "Learn SQL in your browser",
                description:
                  "Open one of a variety of community provided databases to explore live data and learn SQL structures. See how data is organized, try your queries, and learn about the database's schema.",
                image: <Image src={carousel21} alt="Learn SQL in your browser" />,
              },
              {
                title: "Import CSV data to your database",
                description:
                  "Drag and drop your .csv files on the page to create a blank database and import your data. You can edit data, add or delete rows, then share your results as a SQLite database or exported .csv file.",
                image: <Image src={carousel22} alt="Import CSV data to your database" />,
              },
              {
                title: "Export as .csv, open in Excel, or share",
                description:
                  "Take an entire database, a single table or the results of a filtered SQL query and export its data. Open easily in Excel or share your results with others.",
                image: <Image src={carousel23} alt="Export as .csv, open in Excel, or share" />,
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
                  "SQLighter works great with other desktop clients and tools. Run a query and export your data to Excel or csv.",
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
          title="100% Open source"
          description="Built on many popular open source projects"
          text="We owe to a rich collection of projects built by a dedicated community of thousands of contibutors. SQLighter welcomes your contribution and embraces open source with a full MIT license. Please get in touch for comments, feature requests, pull requests, suggestions, etc."
          buttons={<ContributeButton />}
          variant="center"
        />
        <Area background="gray">
          <Faq
            title="FAQs"
            faqs={[
              {
                title: "What is SQLighter?",
                description: "SQLighter is a database explorer for SQLite databases that runs in your browser.",
              },
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
                  "No. If you signin with your email, we use it to store bookmarks and customize your experience. Your email or other data is never sold or transferred, see our Privacy Policy.",
                link: "/privacy",
              },
            ]}
          />
        </Area>
        <Chapter
          icon={<Image src={markPrimary} width={80} height={80} alt="SQLighter" />}
          title="Show the world how it’s done"
          description="Get started with a more powerful tool today"
          image="/site/closing.png"
          buttons={<TryButton />}
          variant="center"
        />
      </Box>
    </OnePageLayout>
  )
}

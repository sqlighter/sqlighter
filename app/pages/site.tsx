//
// site.tsx - one pager site
//

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
      <a href="https://www.sqlite.org/" target="_blank">
        <img src="/logos/sqlite.svg" height={36} title="SQLite" />
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
      <a href="https://nextjs.org/" target="_blank">
        <img src="/logos/nextjs.svg" height={44} title="Next.js" />
      </a>
    </Stack>
  )

  return (
    <OnePageLayout description="lighter, faster" actions={<TryButton height={50} />}>
      <Box className="Site-root" sx={Site_SxProps}>
        <Chapter
          className="Site-hero"
          icon="/branding/mark-primary.png"
          title="SQLite comes alive in your browser"
          description="Open your database or create one, import data, run your queries, share results, learn SQL and more... All within your browser. No downloads required."
          buttons={<TryButton variant="contained" />}
          image="/site/hero.webp"
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
                image: "/site/carousel-1-1.webp",
              },
              {
                title: "Tab based interface",
                description:
                  "Open lots of tabs and work on multiple queries at once without changing windows. Table definitions, query results, schemas each have their own tabs.",
                image: "/site/carousel-1-2.webp",
              },
              {
                title: "Modern SQL editor",
                description:
                  "IntelliSense provides smart code completions for your queries with syntax highlighting and validation. Type faster with fewer mistakes. Pretty print on demand.",
                image: "/site/carousel-1-3.webp",
              },
              {
                title: "Save queries and results",
                description:
                  "Bookmark your queries in your user profile and access them anywhere from multiple computers. Access a query's history to see all its versions and modifications.",
                image: "/site/carousel-1-4.webp",
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
                image: "/site/carousel-2-2.webp",
              },
              {
                title: "Import CSV data to your database",
                description:
                  "Drag and drop your .csv files on the page to create a blank database and import your data. You can edit data, add or delete rows, then share your results as a SQLite database or exported .csv file.",
                image: "/site/carousel-2-1.webp",
              },
              {
                title: "Export as .csv, open in Excel, or share",
                description:
                  "Take an entire database, a single table or the results of a filtered SQL query and export its data. Open easily in Excel or share your results with others.",
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
          title="100% Open Source"
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

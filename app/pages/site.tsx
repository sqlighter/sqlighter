//
// index.tsx - one pager site
//

import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Area } from "../components/onepage/area"
import { TabSet } from "../components/onepage/tabset"

export function TryButton(props) {
  return <Button variant="contained">Try</Button>
}

export default function SitePage() {
  return (
    <OnePageLayout description="lighter, faster">
      <Area>
        <Typography variant="h3">Secure, smart, and easy to use email</Typography>
        <Typography variant="h6">
          Get more done with Gmail. Now integrated with Google Chat, Google Meet, and more, all in one place.
        </Typography>
        <img src="/site/hero.webp" height={300} />
        <TryButton />
      </Area>
      <Area>
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
        block 4 // icon features // 3 features
        <br />
        Hell of +1 mlkshk, celiac hammock helvetica single-origin coffee. Marfa humblebrag pok pok, poutine fixie
        authentic scenester af gastropub yr mixtape health goth man braid jean shorts. Wayfarers snackwave polaroid
        mustache adaptogen vegan. Chia readymade cred coloring book la croix copper mug.
      </Area>
      <Area>
        block 5 // open source icons &amp; karma // numbers
        <br />
        Fam helvetica man bun, authentic schlitz disrupt vegan cold-pressed tumblr coloring book. Sriracha lumbersexual
        chicharrones, swag mlkshk palo santo tilde iceland typewriter marfa literally. Polaroid cornhole biodiesel 90's
        waistcoat. Polaroid cornhole fashion axe mumblecore truffaut, health goth scenester you probably haven't heard
        of them kale chips hell of viral. Twee pork belly mumblecore brooklyn poke, hoodie cloud bread wolf street art.
        Mustache yuccie green juice wolf vinyl pitchfork cliche drinking vinegar scenester.
      </Area>
      <Area background="gray">
        block 6 // FAQs
        <br />
        Hell of +1 mlkshk, celiac hammock helvetica single-origin coffee. Marfa humblebrag pok pok, poutine fixie
        authentic scenester af gastropub yr mixtape health goth man braid jean shorts. Wayfarers snackwave polaroid
        mustache adaptogen vegan. Chia readymade cred coloring book la croix copper mug.
      </Area>
      <Area>
        block 7 // closing // show the world how it's done <br />
        Fam helvetica man bun, authentic schlitz disrupt vegan cold-pressed tumblr coloring book. Sriracha lumbersexual
        chicharrones, swag mlkshk palo santo tilde iceland typewriter marfa literally. Polaroid cornhole biodiesel 90's
        waistcoat. Polaroid cornhole fashion axe mumblecore truffaut, health goth scenester you probably haven't heard
        of them kale chips hell of viral. Twee pork belly mumblecore brooklyn poke, hoodie cloud bread wolf street art.
        Mustache yuccie green juice wolf vinyl pitchfork cliche drinking vinegar scenester.
      </Area>
    </OnePageLayout>
  )
}

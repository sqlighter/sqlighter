//
// oneage/onepagelayout.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { TabSet } from "../components/onepage/tabset"

export default {
  title: "OnePage/TabSet",
  component: TabSet,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Email that's secure, private, and puts you in control.",
    tabs: [
      {
        title: "We never use your Gmail content for any ads purposes",
        description:
          "Gmail uses industry-leading encryption for all messages you receive and send. We never use your Gmail content to personalize ads.",
        image: "/test/tabset0.webp",
      },
      {
        title: "Gmail keeps over a billion people safe every day",
        description: "Gmail blocks 99.9% of spam, malware, and dangerous links from ever reaching your inbox.",
        image: "/test/tabset1.webp",
      },
      {
        title: "The most advanced phishing protections available",
        description:
          "When a suspicious email arrives that could be legitimate, Gmail lets you know, keeping you in control",
        image: "/test/tabset2.webp",
      },
      {
        title: "Best-in-class controls over emails you send",
        description:
          "Confidential Mode lets you set expirations and require recipients to verify by text. You can also remove options to forward, copy, download and print.",
        image: "/test/tabset3.webp",
      },
    ],
  },
} as ComponentMeta<typeof TabSet>

const Template: ComponentStory<typeof TabSet> = (args) => <TabSet {...args} />

export const Primary = Template.bind({})

export const WithRightVariant = Template.bind({})
WithRightVariant.args = {
  variant: "right",
  imageHeight: 400,
  title: "Get more done with Gmail",
  tabs: [
    {
      title: "Stay connected and get organized",
      description: "Start a Chat, jump into a video call with Meet, or collaborate in a Doc, all right from Gmail.",
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
  ],
}

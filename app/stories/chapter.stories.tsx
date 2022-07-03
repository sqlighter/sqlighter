//
// oneage/chapter.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { Chapter } from "../components/onepage/chapter"
import { TryButton } from "../components/onepage/trybutton"
import { ContributeButton } from "../components/onepage/contributebutton"

export default {
  title: "OnePage/Chapter",
  component: Chapter,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    icon: "/branding/mark-primary.png",
    title: "Show the world how it’s done",
    description: "Get started today with a more powerful tool",
    image: "/site/closing.webp",
    buttons: <TryButton />,
  },
} as ComponentMeta<typeof Chapter>

const Template: ComponentStory<typeof Chapter> = (args) => <Chapter {...args} />

export const Primary = Template.bind({})

export const WithoutButtons: ComponentStory<typeof Chapter> = (args) => <Chapter {...args} />
WithoutButtons.args = {
  ...Template.args,
  buttons: undefined,
}

export const Center = Template.bind({})
Center.args = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
  variant: "center",
}

export const WithLeftVariant = Template.bind({})
WithLeftVariant.args = {
  title: "Secure, smart, and easy to use email",
  description: "Get more done with Gmail. Now integrated with Google Chat, Google Meet, and more, all in one place.",
  buttons: (
    <>
      <TryButton />
      <ContributeButton />
    </>
  ),
  image: "/site/hero.webp",
  variant: "left",
}

export const WithHeroVariant = Template.bind({})
WithHeroVariant.args = {
  ...WithLeftVariant.args,
  size: "large",
}

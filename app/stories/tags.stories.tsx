//
// tags.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { queryCmd, databaseCmd, printCmd } from "./helpers/fakedata"
import { Tags } from "../components/ui/tags"

export default {
  title: "UI/Tags",
  component: Tags,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    tags: [{ command: queryCmd }, { command: databaseCmd }, { command: printCmd }],
  },
} as ComponentMeta<typeof Tags>

const Template: ComponentStory<typeof Tags> = (args) => <Tags {...args} />

export const Primary = Template.bind({})
Primary.args = {}

export const WithTitles = Template.bind({})
WithTitles.args = {
  tags: [{ title: "This" }, { title: "That" }, { title: "Else" }],
  size: "medium",
  onCommand: null,
}

export const WithSmallTitles = Template.bind({})
WithSmallTitles.args = {
  tags: [{ title: "18 tables" }, { title: "326,000 rows" }, { title: "5.43 MB" }],
  size: "small",
}

export const WithDots = Template.bind({})
WithDots.args = {
  tags: [
    { title: "Good", dot: "success" },
    { title: "Bad", dot: "warning" },
    { title: "Evil", dot: "error" },
  ],
}

export const WithLinks = Template.bind({})
WithLinks.args = {
  tags: [
    { title: "Wikipedia", href: "https://www.wikipedia.org" },
    { title: "Weather", href: "https://weather.com" },
    { title: "GitHub", href: "https://github.com" },
  ],
}

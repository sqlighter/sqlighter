//
// section.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Section } from "../components/ui/section"
import { StorybookDecorator } from "./helpers/storybook"
import { sqlCmd, dataCmd, chartCmd, printCmd } from "./helpers/fakedata"

export default {
  title: "UI/Section",
  component: Section,
  args: {
    title: "Blockbuster movies",
    description: "A comprehensive list",
  },
} as ComponentMeta<typeof Section>

const Template: ComponentStory<typeof Section> = (args) => (
  <StorybookDecorator>
    <Section {...args}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies
        porttitor ac eu ex. Fusce commodo ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare,
        imperdiet nibh. Suspendisse sagittis consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui
        pellentesque et.
      </p>
      <p>
        Consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies porttitor ac eu ex. Fusce commodo
        ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare, imperdiet nibh. Suspendisse sagittis
        consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui pellentesque et.
      </p>
    </Section>
  </StorybookDecorator>
)

export const Primary = Template.bind({})

export const WithoutDescription = Template.bind({})
WithoutDescription.args = {
  description: null,
}

export const WithLargeVariant = Template.bind({})
WithLargeVariant.args = {
  variant: "large",
}

export const WithAction = Template.bind({})
WithAction.args = {
  action: printCmd,
}

export const WithActionAndCommands = Template.bind({})
WithActionAndCommands.args = {
  commands: [sqlCmd, dataCmd, chartCmd, "spacing", printCmd],
  action: printCmd,
}

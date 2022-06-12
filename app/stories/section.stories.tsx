import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Section } from "../components/ui/section"
import { StorybookDecorator } from "../components/storybook"

export default {
  title: "UI/Section",
  component: Section,
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
Primary.args = {
  title: "Blockbuster movies",
  subtitle: "A comprehensive list",
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  title: "Blockbuster movies",
  subtitle: null,
}

export const WithLargeVariant = Template.bind({})
WithLargeVariant.args = {
  title: "Blockbuster movies",
  subtitle: "A comprehensive list",
  variant: "large",
}

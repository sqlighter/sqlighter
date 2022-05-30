import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Section } from "../components/ui/section"
import { StorybookDecorator } from "../components/storybook"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Section",
  component: Section,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    //
  },
} as ComponentMeta<typeof Section>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
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

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})
Primary.args = {
  title: "Biomarkers",
  subtitle: "A comprehensive list",
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  title: "Biomarkers",
  subtitle: null,
}

export const WithLargeStyle = Template.bind({})
WithLargeStyle.args = {
  title: "Biomarkers",
  subtitle: "A comprehensive list",
  large: true,
}

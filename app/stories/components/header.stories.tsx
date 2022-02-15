import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import { Header } from "../../components/header"
import { Section } from "../../components/section"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/Header",
  component: Header,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    //
  },
} as ComponentMeta<typeof Header>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Header> = (args) => (
  <>
    <Header {...args} />
    <Toolbar />
    <Container maxWidth="sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies porttitor
      ac eu ex. Fusce commodo ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare, imperdiet nibh.
      Suspendisse sagittis consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui pellentesque et.
      <br />
      Consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies porttitor ac eu ex. Fusce commodo
      ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare, imperdiet nibh. Suspendisse sagittis
      consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui pellentesque et.
      <br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies porttitor
      ac eu ex. Fusce commodo ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare, imperdiet nibh.
      Suspendisse sagittis consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui pellentesque et.
      Consectetur adipiscing elit. Suspendisse sit amet enim quis tellus ultricies porttitor ac eu ex. Fusce commodo
      ante vitae luctus euismod. Donec at est faucibus, bibendum nisi ornare, imperdiet nibh. Suspendisse sagittis
      consectetur massa. Vivamus ultricies fermentum felis, auctor vulputate dui pellentesque et.
    </Container>
  </>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "Glucose",
  subtitle: "A type of fat",
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  title: "Journal",
}

export const WithBack = Template.bind({})
WithBack.args = {
  title: "Journal",
  back: "/library",
}

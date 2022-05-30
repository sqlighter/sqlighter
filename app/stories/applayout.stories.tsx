import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { withNextRouter } from "storybook-addon-next-router"

import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import DeleteIcon from "@mui/icons-material/Delete"
import AlarmIcon from "@mui/icons-material/Alarm"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"

import { AppLayout } from "../components/layouts"
import { Section } from "../components/ui/section"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/AppLayout",
  component: AppLayout,
  decorators: [withNextRouter as unknown],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    //
  },
} as ComponentMeta<typeof AppLayout>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppLayout> = (args) => (
  <>
    <AppLayout {...args}>
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
    </AppLayout>
  </>
)

Template.story = {
  parameters: {
    nextRouter: {
      path: "/profile/[id]",
      asPath: "/profile/lifeiscontent",
      query: {
        id: "lifeiscontent",
      },
    },
  },
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = Template.bind({})
Primary.args = {
  title: "Glucose",
  description: "A type of fat",
}

export const WithBack = Template.bind({})
WithBack.args = {
  title: "Glucose",
  description: "A type of fat",
  showBack: true,
}

export const WithActions = Template.bind({})
WithActions.args = {
  title: "Glucose",
  description: "A type of fat",
  actions: (
    <>
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="add an alarm">
        <AlarmIcon />
      </IconButton>
      <IconButton aria-label="add to shopping cart">
        <AddShoppingCartIcon />
      </IconButton>
    </>
  ),
}

export const WithoutSubtitle = Template.bind({})
WithoutSubtitle.args = {
  title: "Journal",
}

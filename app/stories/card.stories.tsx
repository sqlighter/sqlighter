//
// card.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { StorybookDecorator } from "../components/storybook"
import { Card } from "../components/ui/card"
import { databaseCommand, queryCommand, printCommand, settingsCmd } from "./fakedata"

export default {
  title: "UI/Card",
  component: Card,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    image: "/images/empty7.jpg",
    command: databaseCommand,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = (args) => {
  return (
    <Grid container spacing={1} sx={{ maxWidth: 900 }}>
      <Grid item sm={4}>
        <Card {...args} />
      </Grid>
      <Grid item sm={4}>
        <Card {...args} command={queryCommand} image="/images/empty8.jpg" />
      </Grid>
      <Grid item sm={4}>
        <Card {...args} command={printCommand} image="/images/empty9.jpg" />
      </Grid>
    </Grid>
  )
}

export const Primary = Template.bind({})

export const WithSecondaryCommand = Template.bind({})
WithSecondaryCommand.args = {
  secondaryCommand: settingsCmd,
}

export const WithLongLabels = Template.bind({})
WithSecondaryCommand.args = {
  command: {
    ...databaseCommand,
    title: databaseCommand.title + " this is a much longer title",
    description: databaseCommand.description + " this is a much longer description",
  },
}

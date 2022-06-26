//
// card.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Grid from "@mui/material/Grid"
import { StorybookDecorator } from "./helpers/storybook"
import { Card } from "../components/ui/card"
import { databaseCmd, queryCmd, printCmd, settingsCmd } from "./helpers/fakedata"

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
    command: databaseCmd,
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
        <Card {...args} command={queryCmd} image="/images/empty8.jpg" />
      </Grid>
      <Grid item sm={4}>
        <Card {...args} command={printCmd} image="/images/empty9.jpg" />
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
WithLongLabels.args = {
  command: {
    ...databaseCmd,
    title: databaseCmd.title + " this is a much longer title",
    description: databaseCmd.description + " this is a much longer description",
  },
}

export const WithoutImage = Template.bind({})
WithoutImage.args = {
  image: undefined,
}

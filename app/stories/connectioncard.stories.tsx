//
// connectioncard.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Grid from "@mui/material/Grid"
import { StorybookDecorator } from "./helpers/storybook"
import { ConnectionCard } from "../components/database/connectioncard"
import { fake_connection1, fake_connection2, fake_connection3 } from "./helpers/fakedata"

export default {
  title: "Database/ConnectionCard",
  component: ConnectionCard,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    connection: fake_connection1,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof ConnectionCard>

const Template: ComponentStory<typeof ConnectionCard> = (args) => {
  return (
    <Grid container spacing={1} sx={{ maxWidth: 900 }}>
      <Grid item sm={4}>
        <ConnectionCard {...args} />
      </Grid>
      <Grid item sm={4}>
        <ConnectionCard {...args} connection={fake_connection2} />
      </Grid>
      <Grid item sm={4}>
        <ConnectionCard {...args} connection={fake_connection3} />
      </Grid>
    </Grid>
  )
}

export const Primary = Template.bind({})

export const WithoutImage = Template.bind([])
WithoutImage.args = {
  connection: fake_connection2,
}

export const WithConfigureIcon = Template.bind([])
WithConfigureIcon.args = {
  canConfigure: true,
}

//
// connectionpicker.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

import { StorybookDecorator } from "./helpers/storybook"
import { ConnectionPicker } from "../components/database/connectionpicker"
import { Icon } from "../components/ui/icon"
import { fake_connections1, fake_connection1, fake_connection2, fake_connection3 } from "./helpers/fakedata"

export default {
  title: "Database/ConnectionPicker",
  component: ConnectionPicker,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    connection: fake_connection1,
    connections: fake_connections1,
  },
  parameters: {
    grid: { cellSize: 8 },
  },
} as ComponentMeta<typeof ConnectionPicker>

const Template: ComponentStory<typeof ConnectionPicker> = (args) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined">Do This</Button>
      <ConnectionPicker {...args} />
      <Button variant="contained">Do That</Button>
    </Stack>
  )
}

export const Primary = Template.bind({})

export const LongLabel = Template.bind({})
LongLabel.args = {
  connection: fake_connection2,
}

export const ShortLabel = Template.bind({})
ShortLabel.args = {
  connection: fake_connection3,
}

export const Compact = Template.bind({})
Compact.args = {
  variant: "compact",
  buttonVariant: "outlined",
}

const GroupedTemplate: ComponentStory<typeof ConnectionPicker> = (args) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined">Eat</Button>
      <ConnectionPicker {...args}>
        <Button startIcon={<Icon>play</Icon>}>Run</Button>
      </ConnectionPicker>
      <Button variant="contained">Sleep</Button>
    </Stack>
  )
}

export const Grouped = GroupedTemplate.bind({})
Grouped.args = {
  variant: "compact",
}

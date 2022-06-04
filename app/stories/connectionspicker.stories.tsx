//
// queryrunpanel.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

import { StorybookDecorator } from "../components/storybook"
import { QueryPanel } from "../components/database/querypanel"
import { ConnectionPicker } from "../components/database/connectionpicker"
import { fake_connections1, fake_connection1, fake_query1 } from "./fakedata"

export default {
  title: "Components/ConnectionPicker",
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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ConnectionPicker> = (args) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined">Do This</Button>
      <ConnectionPicker {...args} />
      <Button variant="contained">Do That</Button>
    </Stack>
  )
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Primary = Template.bind({})

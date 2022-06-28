//
// titlefield.stories.tsx
//

import React, { useState } from "react"
import Typography from "@mui/material/Typography"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { TitleField } from "../components/ui/titlefield"

function Tester(props) {
  const [title, setTitle] = useState(props.title)
  function handleCommand(e, command) {
    setTitle(command.args.item)
    if (props.onCommand) {
      props.onCommand(e, command)
    }
  }
  return (
    <>
      <TitleField value={title} onCommand={handleCommand} />
      <Typography variant="body1" color="text.secondary">
        Lorem ipsum dolor sit amet, meis necessitatibus ut nam, mea putent persecuti ad, eos an tale vulputate. Vix
        timeam aliquid scriptorem ut, ius eu copiosae elaboraret, dicta meliore scaevola vel et. Nemore partiendo ex
        quo. Ne pri solet pertinacia, quo ne quot constituam. Sed legere phaedrum ex. {title}
      </Typography>
    </>
  )
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/TitleField",
  component: TitleField,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "Mission Impossible 4",
  },
} as ComponentMeta<typeof TitleField>

const Template: ComponentStory<typeof TitleField> = (args) => <Tester {...args} />

export const Primary = Template.bind({})

export const LongTitle = Template.bind({})
LongTitle.args = {
  title: "Notte d'estate con profilo greco, occhi a mandorla e odore di basilico",
}

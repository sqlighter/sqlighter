import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Avatar from "@mui/material/Avatar"
import List from "@mui/material/List"
import { Section } from "../components/section"
import { ContentListItem } from "../components/listitems"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/ContentListItem",
  component: ContentListItem,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    //
  },
} as ComponentMeta<typeof ContentListItem>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ContentListItem> = (args) => (
  <List>
    <Section title="Biomarkers">
      <ContentListItem {...args} />
      <ContentListItem {...args} />
      <ContentListItem {...args} />
      <ContentListItem {...args} />
      <ContentListItem {...args} />
    </Section>
  </List>
)

// More on args: https://storybook.js.org/docs/react/writing-stories/args

const cholesterol = {
  title: "Cholesterol",
  description: "A kind of fat in your blood",
  imageUrl: "https://biomarkers.app/api/contents/biomarkers/images/cholesterol.jpeg",
  url: "https://biomarkers.app/biomarkers/cholesterol",
}

export const Primary = Template.bind({})
Primary.args = {
  item: cholesterol,
}

export const WithLongDescription = Template.bind({})
WithLongDescription.args = {
  item: {
    ...cholesterol,
    title: "You guide to a healthy liver. What to expect from your blood test",
    description: "This is a really long description that should be clipped because it also really too long",
  },
}

export const WithSecondaryAction = Template.bind({})
WithSecondaryAction.args = {
  item: cholesterol,
  secondaryAction: <Avatar alt="Name" />,
}

export const WithSecondaryActionAndLongDescription = Template.bind({})
WithSecondaryActionAndLongDescription.args = {
  item: {
    ...cholesterol,
    description: "This is a really long description that should be clipped because it also really too long",
  },
  secondaryAction: <Avatar alt="Name" />,
}

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Box, Stack, Typography } from "@mui/material"
import { StorybookDecorator } from "./helpers/storybook"
import { IconButton } from "../components/ui/iconbutton"
import { Display, Headline, Title, Body, Label } from "../components/ui/typography"
import Chip from "@mui/material/Chip"

function Boxy(props) {
  return (
    <Box sx={{ width: 600, border: 1, borderRadius: 1, borderColor: "lightGrary", padding: 1, mb: 2 }}>
      {props.children}
      <Typography variant={props.body || "body1"} color="text.secondary">
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at
        its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters (
        {props.body || "body1"}).
      </Typography>
      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
        {props.tags &&
          props.tags.split(",").map((tag) => {
            return <Chip size="small" label={tag} />
          })}
      </Stack>
    </Box>
  )
}

// https://m3.material.io/styles/typography/type-scale-tokens

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/Typography",
  component: Display,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
} as ComponentMeta<typeof Display>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const DisplayTemplate: ComponentStory<typeof IconButton> = (args) => <Display {...args}>Display</Display>
export const DisplaySmall = DisplayTemplate.bind({})
DisplaySmall.args = {
  size: "small",
}

export const DisplayMedium = DisplayTemplate.bind({})
DisplayMedium.args = {
  size: undefined,
}

export const DisplayLarge = DisplayTemplate.bind({})
DisplayLarge.args = {
  size: "large",
}

const PrimaryTemplate: ComponentStory<typeof IconButton> = (args) => {
  return (
    <>
      <Boxy tags="display,medium">
        <Display size="medium">Display</Display>
      </Boxy>
      <Boxy tags="headline,medium">
        <Headline size="medium">Headline</Headline>
      </Boxy>
      <Boxy tags="title,large">
        <Title size="large">Large Title</Title>
      </Boxy>
      <Boxy tags="title,medium">
        <Title size="medium">Title</Title>
      </Boxy>
      <Boxy tags="title,small" body="body2">
        <Title size="small">Small Title</Title>
      </Boxy>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Label size="medium">Label (medium)</Label>
        <Label size="small">Label (small)</Label>
      </Box>
    </>
  )
}
export const Primary = PrimaryTemplate.bind({})

const SideBySideTemplate: ComponentStory<typeof IconButton> = (args) => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box sx={{ display: "flex", flexDirection: "column", width: 480, paddingRight: 2 }}>
          <Typography variant="caption" color="primary.main">
            Material UI
          </Typography>

          <Typography variant="h1">h1. Heading</Typography>
          <Typography variant="h2">h2. Heading</Typography>
          <Typography variant="h3">h3. Heading</Typography>
          <Typography variant="h4">h4. Heading</Typography>
          <Typography variant="h5">h5. Heading</Typography>
          <Typography variant="h6" mb={2}>
            h6. Heading
          </Typography>

          <Typography variant="subtitle1">subtitle1. Lorem ipsum dolor sit amet</Typography>
          <Typography variant="subtitle2" mb={2}>
            subtitle2. Lorem ipsum dolor sit amet
          </Typography>

          <Typography variant="body1" mb={2}>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam
            beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
            Eum quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" mb={2}>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam
            beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
            Eum quasi quidem quibusdam.
          </Typography>

          <Typography variant="button">Button Text</Typography>
          <Typography variant="caption">Caption Text</Typography>
          <Typography variant="overline">Overline Text</Typography>
        </Box>
        <Box sx={{ width: 480 }}>
          <Typography variant="caption" color="primary.main">
            Material 3
          </Typography>

          <Display size="medium">Display (medium)</Display>
          <Body mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
            rerum inventore consectetur, neque doloribus.
          </Body>

          <Headline size="medium">Headline (medium)</Headline>
          <Body mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
            rerum inventore consectetur, neque doloribus.
          </Body>

          <Title size="large">Title (large)</Title>
          <Body mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
            rerum inventore consectetur, neque doloribus.
          </Body>

          <Title size="medium">Title (medium)</Title>
          <Body mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
            rerum inventore consectetur, neque doloribus.
          </Body>

          <Title size="small">Title (small)</Title>
          <Body size="small" mb={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae
            rerum inventore consectetur, neque doloribus.
          </Body>
        </Box>
      </Stack>
    </>
  )
}
export const SideBySide = SideBySideTemplate.bind({})
SideBySide.args = {
  text: null,
}

//
// oneage/onepagelayout.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import { StorybookDecorator } from "./helpers/storybook"
import { OnePageLayout } from "../components/onepage/onepagelayout"
import { Typography } from "@mui/material"

export default {
  title: "OnePage/OnePageLayout",
  component: OnePageLayout,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    title: "A page",
    children: <>This is the content</>,
  },
} as ComponentMeta<typeof OnePageLayout>

const Template: ComponentStory<typeof OnePageLayout> = (args) => <OnePageLayout {...args} />

export const Primary = Template.bind({})

export const WithLotsOfContent = Template.bind({})
WithLotsOfContent.args = {
  title: "Terms of Service",
  children: (
    <>
      <Typography variant="h3">Terms of Service</Typography>
      <p>
        I'm baby pitchfork mumblecore schlitz snackwave air plant, tumblr cold-pressed succulents blog brooklyn unicorn
        franzen. Banh mi scenester la croix single-origin coffee raclette 3 wolf moon selvage squid, hoodie trust fund
        tilde literally mixtape before they sold out craft beer. Hashtag leggings 8-bit hell of kale chips. Skateboard
        pop-up iceland salvia brooklyn art party XOXO asymmetrical tattooed normcore tilde. Pabst stumptown biodiesel
        keytar adaptogen four loko franzen taiyaki praxis. Viral williamsburg hoodie, iceland butcher forage air plant
        cred.
      </p>
      <p>
        Flexitarian cold-pressed ethical raw denim, yr tumblr squid blue bottle distillery gluten-free DSA. Truffaut
        church-key selfies tousled, helvetica woke yes plz VHS beard pork belly tacos fanny pack drinking vinegar. Small
        batch prism jianbing, raw denim hexagon cliche street art typewriter bicycle rights normcore. Artisan VHS irony
        chicharrones, +1 cred air plant blog semiotics palo santo.
      </p>
      <p>
        8-bit skateboard synth, freegan gentrify ethical bicycle rights vice retro copper mug cornhole four dollar toast
        hella mlkshk knausgaard. Letterpress iPhone mixtape coloring book, church-key prism williamsburg. Meditation
        sriracha helvetica twee. Subway tile blog mixtape iceland.
      </p>
      <p>
        Hell of +1 mlkshk, celiac hammock helvetica single-origin coffee. Marfa humblebrag pok pok, poutine fixie
        authentic scenester af gastropub yr mixtape health goth man braid jean shorts. Wayfarers snackwave polaroid
        mustache adaptogen vegan. Chia readymade cred coloring book la croix copper mug.
      </p>
      <p>
        Fam helvetica man bun, authentic schlitz disrupt vegan cold-pressed tumblr coloring book. Sriracha lumbersexual
        chicharrones, swag mlkshk palo santo tilde iceland typewriter marfa literally. Polaroid cornhole biodiesel 90's
        waistcoat. Polaroid cornhole fashion axe mumblecore truffaut, health goth scenester you probably haven't heard
        of them kale chips hell of viral. Twee pork belly mumblecore brooklyn poke, hoodie cloud bread wolf street art.
        Mustache yuccie green juice wolf vinyl pitchfork cliche drinking vinegar scenester.
      </p>
      <p>
        Chartreuse adaptogen drinking vinegar cronut fixie tbh church-key keffiyeh try-hard distillery live-edge praxis
        edison bulb shaman vice. Narwhal woke glossier craft beer williamsburg pour-over. Schlitz etsy praxis readymade,
        lomo you probably haven't heard of them art party letterpress church-key small batch. Lumbersexual four dollar
        toast kale chips, ramps banjo fashion axe prism organic letterpress. Irony iPhone adaptogen authentic, tonx
        waistcoat unicorn next level.
      </p>
    </>
  ),
}

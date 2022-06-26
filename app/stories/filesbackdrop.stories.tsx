//
// filesbackdrop.stories.tsx
//

import React from "react"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { StorybookDecorator } from "./helpers/storybook"
import { FilesBackdrop } from "../components/ui/filesbackdrop"

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "UI/FilesBackdrop",
  component: FilesBackdrop,
  decorators: [
    (Story) => (
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    ),
  ],
  args: {
    open: true,
  },
} as ComponentMeta<typeof FilesBackdrop>

const Template: ComponentStory<typeof FilesBackdrop> = (args) => (
  <Box sx={{ width: 1, height: 300 }}>
    <FilesBackdrop {...args} />
    <Typography variant="h6">Drag files here to see backdrop</Typography>
    <Typography variant="body1">
      <p>
        Cupcake ipsum dolor sit amet. Gingerbread cookie shortbread topping wafer. Macaroon tootsie roll dessert cake
        danish chocolate bar dessert. Pudding tootsie roll gummies liquorice ice cream danish marzipan powder. Jelly
        beans wafer icing chupa chups gingerbread macaroon cupcake fruitcake toffee. Sugar plum wafer bear claw dessert
        chocolate cake lemon drops danish ice cream. Wafer cake shortbread halvah biscuit. Cake oat cake apple pie
        liquorice lollipop cake jujubes dragée brownie. Topping tiramisu gummies danish chocolate lollipop bonbon sweet
        soufflé. Oat cake gummi bears dessert dragée gummi bears gummi bears. Carrot cake sweet roll pastry candy apple
        pie fruitcake. Dessert jujubes fruitcake lemon drops cupcake bonbon bear claw cheesecake powder. Donut fruitcake
        jujubes liquorice liquorice cake gingerbread liquorice candy canes. Halvah cake jelly-o tootsie roll sugar plum
        cake croissant. Jelly-o jelly danish sugar plum cookie. Muffin halvah tiramisu tart powder donut chupa chups.
      </p>
      <p>
        Marshmallow marzipan marshmallow soufflé tart sugar plum dragée. Danish shortbread fruitcake cake toffee sugar
        plum lemon drops. Bonbon jelly-o bonbon pudding marshmallow dragée oat cake. Muffin marzipan macaroon donut
        liquorice caramels. Powder wafer shortbread candy canes cheesecake cotton candy liquorice. Sweet dragée bonbon
        cupcake lemon drops candy chupa chups apple pie. Cheesecake pie pudding donut lemon drops candy ice cream.
        Soufflé chocolate wafer tiramisu chocolate bar. Sugar plum tart marshmallow cake gummi bears. Lemon drops
        tootsie roll pastry halvah biscuit oat cake jelly beans. Oat cake danish powder marzipan bonbon. Sugar plum
        toffee macaroon donut jujubes muffin. Macaroon cupcake sugar plum gingerbread powder oat cake jujubes cookie.
      </p>
      <p>
        Danish gummies halvah marshmallow ice cream. Bear claw brownie jelly beans macaroon jelly beans danish tiramisu.
        Carrot cake cake cheesecake caramels bear claw. Danish bonbon sesame snaps cake liquorice. Sweet roll oat cake
        soufflé sweet roll lemon drops. Icing bear claw bonbon oat cake wafer chupa chups oat cake. Powder chocolate
        cake liquorice powder. Apple pie oat cake cotton candy sesame snaps muffin chupa chups tart biscuit pastry.
        Sesame snaps cake brownie shortbread cookie cheesecake tiramisu powder sesame snaps.
      </p>
    </Typography>
  </Box>
)
export const Primary = Template.bind({})

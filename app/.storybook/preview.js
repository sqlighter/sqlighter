// .storybook/preview.js
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
import { StorybookDecorator } from "../components/storybook"
export const decorators = [
  // TODO I have no idea why but the theme wrapper only works in "Docs" and not in "Canvas" and also only works if we wrap two of them, hmmmm
  (Story) => (
    <StorybookDecorator>
      <StorybookDecorator>
        <Story />
      </StorybookDecorator>
    </StorybookDecorator>
  ),
]

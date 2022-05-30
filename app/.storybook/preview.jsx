
import { StorybookDecorator } from "../stories/decorator"

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

export const decorators = [StorybookDecorator()]

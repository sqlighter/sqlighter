// .storybook/preview.js

// import { StorybookDecorator } from "../components/storybook"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// TODO figure out why using decorator in preview.jsx locks storybook into an infinite spinner
// export const decorators = [StorybookDecorator()]

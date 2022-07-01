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
  backgrounds: {
    grid: { cellSize: 8 },
  },
  options: {
    storySort: {
      order: ["Activities", "Tabs", "Database", "Navigation", "UI", "Auth", "OnePage"],
    },
  },
}

// TODO figure out why using decorator in preview.jsx locks storybook into an infinite spinner
// export const decorators = [StorybookDecorator()]

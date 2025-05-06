import { fn } from "@storybook/test"
import layout from "../../dist/waterfall/layout.hbs"
import tile from "../../dist/waterfall/tile.hbs"
// import css from "../../dist/waterfall/widget.css"
import js from "../../dist/waterfall/widget.js"
// import widgetOptionsTemplate from "../../dist/waterfall/widget.options.hbs"
// import file from preview.html

import type { Meta, StoryObj } from "@storybook/web-components"
// import widgetOptions from '../../tests/fixtures/widget.options';


// console.log("localData", layout);

// console.log("localData", JSON.stringify(css));

const widgetOptionsTemplate = `{}`;
const css = `#container {
  background: #fff;
  padding: 20px;
}`;

const previewHtmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Preview</title>
  <!-- IMP: Please don't modify the port below. We don't need this file fetched from local server as we don't do any changes in this file here -->
  <script type="text/javascript" src="https://widget-ui.teaser.stackla.com/local/core.js?widgetType={{{widgetType}}}"></script>
</head>

<body style="margin: 0;">
Hello World
  <div id="container" style="width: 80%; margin: 0 auto;">
    <div id="ugc-widget" data-wid='668ca52ada8fb'></div>
  </div>
  <script> 
    const cssTemplate = \`${css}\`;
    const layoutTemplate = \`${layout}\`;
    const tileTemplate = \`${tile}\`;
    const jsTemplate = ${JSON.stringify(js)};
    const widgetOptions = \`${widgetOptionsTemplate}\`;

    var stackWidgetCustomData = {};
    const widgetParams = {
      "draft": {
        "enabled": 1,
        "guid": "668ca52ada8fb",
        "filter_id": 10695,
        "enabled": 1,
        "customCSS": cssTemplate,
        "customJS": jsTemplate,
        "customTemplates": {
          "layout": {
            "template": layoutTemplate,
          },
          "tile": {
            "template": tileTemplate,
          },
        },
        "widgetOptions": widgetOptions,
      },
      "wid": "668ca52ada8fb",
      "limit": 25,
      "page": 1
    };
    const widget = new window.ugc.widget(widgetParams);
    widget.init();
  </script>
</body>

</html>`
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: "Example/Button",
  tags: ["autodocs"],
  render: args => previewHtmlTemplate,
  argTypes: {
    backgroundColor: { control: "color" },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"]
    }
  },
  args: { onClick: fn() }
} satisfies Meta

export default meta
type Story = StoryObj

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button test"
  }
}

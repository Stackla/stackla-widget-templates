import widgetOptions from "../../tests/fixtures/widget.options"

export interface IDraftRequest {
  custom_templates: {
    layout: {
      template: string
    }
    tile: {
      template: string
    }
  }
  customCSS: string
  customJS: string
  widgetOptions: typeof widgetOptions
}

export type PreviewContent = {
  layoutCode: string
  tileCode: string
  cssCode: string
  jsCode: string
}
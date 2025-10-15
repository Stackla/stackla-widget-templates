import type { Express } from "express"
import type { Hono } from "hono"
import nostoApiJS from "../data/nosto-api"
import * as path from "node:path"
import * as fs from "node:fs"

export const STAGING_UI_URL = "https://widget-ui.teaser.stackla.com"

export const createMockRoutes = (app: Express | Hono) => {
  const isHono = "get" in app && typeof app.get === "function" && !("listen" in app)

  if (isHono) {
    // Hono implementation
    const honoApp = app as Hono

    honoApp.get("/development/stackla/cs/image/disable", c => {
      return c.json({ success: true })
    })

    honoApp.get("/development/nosto/shopify-64671154416", c => {
      return c.text(nostoApiJS)
    })

    honoApp.get("/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js", c => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-laptop.json"), "utf-8")
      return c.json(JSON.parse(fileData))
    })

    honoApp.get("/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js", c => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-tv.json"), "utf-8")
      return c.json(JSON.parse(fileData))
    })

    honoApp.get("/development/products/contrast-felted-sweater-black.js", c => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/contrast-felted-sweater-black.json"), "utf-8")
      return c.json(JSON.parse(fileData))
    })

    honoApp.get("/development/products/desna-dress.js", c => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/desna-dress.json"), "utf-8")
      return c.json(JSON.parse(fileData))
    })

    honoApp.get("/development/products/pure-city-vintage-leather-saddle.js", c => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/pure-city-vintage-leather-saddle.json"), "utf-8")
      return c.json(JSON.parse(fileData))
    })

    honoApp.get("/development/widget/show", c => {
      return c.redirect(
        "https://goconnect.teaser.stackla.com/widget/show?v=1&plugin_id=663acb8116377&editor_console=",
        302
      )
    })

    honoApp.get("/development/widgets/:wid/direct-uploader", c => {
      return c.json({
        id: 5525,
        config: {
          domains: [],
          term_id: 93450,
          tags: [32128],
          topic: {
            display: false,
            mandatory: true
          },
          topic_options: [],
          topic_css: "",
          media: {
            display: true,
            mandatory: true
          },
          media_options: ["image", "video", "audio"],
          media_options_video_length: 300,
          media_allow_multiple: true,
          comment: {
            display: true,
            mandatory: true
          },
          firstname: {
            display: true,
            mandatory: true
          },
          lastname: {
            display: true,
            mandatory: true
          },
          email: {
            display: true,
            mandatory: true
          },
          terms_and_conditions_url: "",
          terms_and_conditions: {
            display: true,
            mandatory: true
          },
          recaptcha: {
            display: true,
            mandatory: true
          },
          show_progress_bar: true,
          show_powered_by_stackla: true,
          force_approve: true,
          external_data: [],
          custom_data: [],
          display_mode: "",
          connected_widget_id: null,
          custom_input: {
            display: false,
            mandatory: true
          },
          custom_input_label: "",
          custom_checkbox: {
            display: false,
            mandatory: true
          },
          custom_checkbox_label: ""
        },
        stackId: 1451,
        guid: "663acb8116377"
      })
    })

    honoApp.get("/development/widgets/:wid/direct-uploader/0", c => {
      return c.json({
        id: 5525,
        config: {
          domains: [],
          term_id: 93450,
          tags: [32128],
          topic: {
            display: false,
            mandatory: true
          },
          topic_options: [],
          topic_css: "",
          media: {
            display: true,
            mandatory: true
          },
          media_options: ["image", "video", "audio"],
          media_options_video_length: 300,
          media_allow_multiple: true,
          comment: {
            display: true,
            mandatory: true
          },
          firstname: {
            display: true,
            mandatory: true
          },
          lastname: {
            display: true,
            mandatory: true
          },
          email: {
            display: true,
            mandatory: true
          },
          terms_and_conditions_url: "",
          terms_and_conditions: {
            display: true,
            mandatory: true
          },
          recaptcha: {
            display: true,
            mandatory: true
          },
          show_progress_bar: true,
          show_powered_by_stackla: true,
          force_approve: true,
          external_data: [],
          custom_data: [],
          display_mode: "",
          connected_widget_id: null,
          custom_input: {
            display: false,
            mandatory: true
          },
          custom_input_label: "",
          custom_checkbox: {
            display: false,
            mandatory: true
          },
          custom_checkbox_label: ""
        },
        stackId: 1451,
        guid: "663acb8116377"
      })
    })
  } else {
    // Express implementation (existing code)
    const expressApp = app as Express
    // Express implementation (existing code)
    const expressApp = app as Express

    expressApp.get("/development/stackla/cs/image/disable", (_req, res) => {
      res.json({ success: true })
    })

    expressApp.get("/development/nosto/shopify-64671154416", (_req, res) => {
      res.send(nostoApiJS)
    })

    expressApp.get(
      "/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js",
      (_req, res) => {
        const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-laptop.json"), "utf-8")
        res.json(JSON.parse(fileData))
      }
    )

    expressApp.get("/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js", (_req, res) => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-tv.json"), "utf-8")
      res.json(JSON.parse(fileData))
    })

    expressApp.get("/development/products/contrast-felted-sweater-black.js", (_req, res) => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/contrast-felted-sweater-black.json"), "utf-8")
      res.json(JSON.parse(fileData))
    })

    expressApp.get("/development/products/desna-dress.js", (_req, res) => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/desna-dress.json"), "utf-8")
      res.json(JSON.parse(fileData))
    })

    expressApp.get("/development/products/pure-city-vintage-leather-saddle.js", (_req, res) => {
      const fileData = fs.readFileSync(path.resolve("src/tests/mock/pure-city-vintage-leather-saddle.json"), "utf-8")
      res.json(JSON.parse(fileData))
    })

    expressApp.get("/development/widget/show", (_req, res) => {
      res.redirect(302, "https://goconnect.teaser.stackla.com/widget/show?v=1&plugin_id=663acb8116377&editor_console=")
    })

    expressApp.get("/development/widgets/:wid/direct-uploader", (_req, res) => {
      res.json({
        id: 5525,
        config: {
          domains: [],
          term_id: 93450,
          tags: [32128],
          topic: {
            display: false,
            mandatory: true
          },
          topic_options: [],
          topic_css: "",
          media: {
            display: true,
            mandatory: true
          },
          media_options: ["image", "video", "audio"],
          media_options_video_length: 300,
          media_allow_multiple: true,
          comment: {
            display: true,
            mandatory: true
          },
          firstname: {
            display: true,
            mandatory: true
          },
          lastname: {
            display: true,
            mandatory: true
          },
          email: {
            display: true,
            mandatory: true
          },
          terms_and_conditions_url: "",
          terms_and_conditions: {
            display: true,
            mandatory: true
          },
          recaptcha: {
            display: true,
            mandatory: true
          },
          show_progress_bar: true,
          show_powered_by_stackla: true,
          force_approve: true,
          external_data: [],
          custom_data: [],
          display_mode: "",
          connected_widget_id: null,
          custom_input: {
            display: false,
            mandatory: true
          },
          custom_input_label: "",
          custom_checkbox: {
            display: false,
            mandatory: true
          },
          custom_checkbox_label: ""
        },
        stackId: 1451,
        guid: "663acb8116377"
      })
    })

    expressApp.get("/development/widgets/:wid/direct-uploader/0", (_req, res) => {
      res.json({
        id: 5525,
        config: {
          domains: [],
          term_id: 93450,
          tags: [32128],
          topic: {
            display: false,
            mandatory: true
          },
          topic_options: [],
          topic_css: "",
          media: {
            display: true,
            mandatory: true
          },
          media_options: ["image", "video", "audio"],
          media_options_video_length: 300,
          media_allow_multiple: true,
          comment: {
            display: true,
            mandatory: true
          },
          firstname: {
            display: true,
            mandatory: true
          },
          lastname: {
            display: true,
            mandatory: true
          },
          email: {
            display: true,
            mandatory: true
          },
          terms_and_conditions_url: "",
          terms_and_conditions: {
            display: true,
            mandatory: true
          },
          recaptcha: {
            display: true,
            mandatory: true
          },
          show_progress_bar: true,
          show_powered_by_stackla: true,
          force_approve: true,
          external_data: [],
          custom_data: [],
          display_mode: "",
          connected_widget_id: null,
          custom_input: {
            display: false,
            mandatory: true
          },
          custom_input_label: "",
          custom_checkbox: {
            display: false,
            mandatory: true
          },
          custom_checkbox_label: ""
        },
        stackId: 1451,
        guid: "663acb8116377"
      })
    })
  }
}

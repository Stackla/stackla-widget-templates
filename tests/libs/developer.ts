import type { Express } from "express"
import nostoApiJS from "../data/nosto-api"
import * as path from "node:path"
import * as fs from "node:fs"

export const STAGING_UI_URL = "https://widget-ui.teaser.stackla.com"

export const createMockRoutes = (app: Express) => {
  app.get("/development/stackla/cs/image/disable", (_req, res) => {
    res.json({ success: true })
  })

  app.get("/development/nosto/shopify-64671154416", (_req, res) => {
    res.send(nostoApiJS)
  })

  app.get("/development/stackla/autoload", async (req, res) => {
    res.redirect(
      301,
      "/autoload?" +
        Object.keys(req.query)
          .map(key => `${key}=${req.query[key]}`)
          .join("&")
    )
  })

  app.get("/development/products/asus-tuf-f15-15-6-fhd-144hz-gaming-laptop-1tbgeforce-rtx-3050.js", (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-laptop.json"), "utf-8")
    res.json(JSON.parse(fileData))
  })

  app.get("/development/products/samsung-98-qn90d-neo-qled-4k-smart-tv-2024.js", (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("src/tests/mock/atc-tv.json"), "utf-8")
    res.json(JSON.parse(fileData))
  })

  app.get("/development/products/contrast-felted-sweater-black.js", (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("src/tests/mock/contrast-felted-sweater-black.json"), "utf-8")
    res.json(JSON.parse(fileData))
  })

  app.get("/development/products/desna-dress.js", (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("src/tests/mock/desna-dress.json"), "utf-8")
    res.json(JSON.parse(fileData))
  })

  app.get("/development/products/pure-city-vintage-leather-saddle.js", (_req, res) => {
    const fileData = fs.readFileSync(path.resolve("src/tests/mock/pure-city-vintage-leather-saddle.json"), "utf-8")
    res.json(JSON.parse(fileData))
  })

  app.get("/development/widget/show", (_req, res) => {
    res.redirect(302, "https://goconnect.teaser.stackla.com/widget/show?v=1&plugin_id=663acb8116377&editor_console=")
  })

  app.get("/development/widgets/668ca52ada8fb/direct-uploader", (_req, res) => {
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

  app.get("/development/widgets/668ca52ada8fb/direct-uploader/0", (_req, res) => {
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

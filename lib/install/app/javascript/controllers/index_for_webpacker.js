import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.warnings = true
application.debug    = false
window.Stimulus      = application

// Import and register all your controllers within this directory and all subdirectories
// Controller files must be named *_controller.js or *_controller.ts
import { definitionsFromContext } from "@hotwired/stimulus"
const context = require.context("controllers", true, /_controller\.(js|ts)$/)
application.load(definitionsFromContext(context))

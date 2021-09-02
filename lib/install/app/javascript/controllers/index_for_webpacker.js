import { Application, definitionsFromContext } from "@hotwired/stimulus"

const application = Application.start()

// Setup Stimulus development experience
application.warnings = true
application.debug    = false
window.Stimulus      = application

// Load all the controllers within this directory and all subdirectories. 
// Controller files must be named *_controller.js or *_controller.ts.
const context = require.context("controllers", true, /_controller\.(js|ts)$/)
application.load(definitionsFromContext(context))

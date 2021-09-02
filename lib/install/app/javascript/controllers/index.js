// Load all the controllers within this directory and all subdirectories. 
// Controller files must be named *_controller.js or *_controller.ts.

import { Application, definitionsFromContext } from "@hotwired/stimulus"

const application = Application.start()

const context = require.context("controllers", true, /_controller\.(js|ts)$/)
application.load(definitionsFromContext(context))

window.Stimulus = application

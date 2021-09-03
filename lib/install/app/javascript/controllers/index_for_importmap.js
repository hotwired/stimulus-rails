import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.warnings = true
application.debug    = false
window.Stimulus      = application

// Import and register all your controllers from the importmap under controllers/*
import { registerControllersFrom } from "@hotwired/stimulus-importmap-autoloader"
const importmap = JSON.parse(document.querySelector("script[type=importmap]").text).imports
registerControllersFrom("controllers", importmap, application)

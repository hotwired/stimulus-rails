import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.warnings = true
application.debug    = false
window.Stimulus      = application

// Import and register all your controllers
import HelloController from "./hello_controller"
application.register("hello", HelloController)

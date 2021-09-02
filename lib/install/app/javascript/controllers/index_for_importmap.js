import { application } from "@hotwired/stimulus-importmap-autoloader"

// Setup Stimulus development experience
application.warnings = true
application.debug    = false
window.Stimulus      = application

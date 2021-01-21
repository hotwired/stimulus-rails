import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "button" ]
  static values = { disableMessage: String, originalText: String  }

  // Listen to form:submit
  disable() {
    this.originalTextValue = this.buttonTarget.value
    this.buttonTarget.disabled = true
    this.buttonTarget.value = this.disableMessageValue
  }

  // Listen to form:submitcanceled
  enable() {
    this.buttonTarget.disabled = false
    this.buttonTarget.value = this.originalTextValue
  }
}

import { Controller } from "stimulus"

export default class extends Controller {
  static values = { message: String };

  // Listen to form:submit
  confirm(event) {
    if (!(window.confirm(this.messageValue))) {
      var customEvent = new CustomEvent("submitcanceled")

      event.preventDefault()
      this.element.dispatchEvent(customEvent)
    }
  }
}

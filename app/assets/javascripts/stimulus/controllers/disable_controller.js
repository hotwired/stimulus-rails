import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "button" ]
  static values = { message: String }

  // Listen to form:submit
  disable() {
    this.buttonTarget.disabled = true;
    this.buttonTarget.value = this.messageValue;
  }
}

import { Controller } from "stimulus"

export default class extends Controller {
  static values = { message: String }

  connect() {
    this.element.innerHTML = this.messageValue
  }
}

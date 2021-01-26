import { Controller } from "stimulus"

export default class extends Controller {
  static classes = [ "toggle" ]

  // Actions

  toggle(event) {
    event.preventDefault()
    this.element.classList.toggle(this.toggleClass)
  }
}

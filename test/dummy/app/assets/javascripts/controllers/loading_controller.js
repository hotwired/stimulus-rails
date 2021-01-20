import { Controller } from "stimulus"

export default class extends Controller {
  static values = { controller: String, html: String }

  loadController() {
    this.element.setAttribute(this.application.schema.controllerAttribute, this.controllerValue)
  }

  injectController() {
    this.element.insertAdjacentHTML("beforeend", this.htmlValue)
  }
}

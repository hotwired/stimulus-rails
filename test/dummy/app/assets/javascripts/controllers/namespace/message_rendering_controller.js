import { Controller } from "stimulus"

export default class extends Controller {
  static values = { message: String }

  connect() {
    this.element.innerHTML = `Namespace: ${this.messageValue}`
  }

  sayHello() {
    this.element.innerHTML = `Hello from Namespace: ${this.messageValue}`
  }
}

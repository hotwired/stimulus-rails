import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() { return [ "input", "output" ] }

  greet() {
    this.outputTarget.innerHTML = `Hello, ${this.inputTarget.value}`
  }
}

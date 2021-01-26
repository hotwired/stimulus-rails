import { Controller } from "stimulus"

export default class extends Controller {
  static values = { delay: Number }

  connect() {
    this.timeout = setTimeout(this.remove, this.delayValue)
  }

  disconnect() {
    clearTimeout(this.timeout)

    this.remove()
  }

  remove = () => {
    this.element.remove()
  }
}

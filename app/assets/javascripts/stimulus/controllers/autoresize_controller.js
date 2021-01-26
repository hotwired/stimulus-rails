// Add to Stimulus!
// import { nextFrame } from "helpers"

import { Controller } from "stimulus"

export default class extends Controller {
  async connect() {
    this.autoresize()
  }

  async autoresize() {
    await nextFrame()
    this.element.style.height = 0
    const offset = this.element.offsetHeight - this.element.clientHeight
    this.element.style.height = `${this.element.scrollHeight + offset}px`
  }
}

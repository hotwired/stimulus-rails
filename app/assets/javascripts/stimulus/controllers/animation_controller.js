// Add to Stimulus!
// import { nextFrame } from "helpers"

import { Controller } from "stimulus"

export default class extends Controller {
  static classes = [ "play" ]

  // Actions

  async play() {
    await nextFrame()
    this.classList.remove(this.playClass)
    this.forceReflow()
    this.classList.add(this.playClass)
  }

  // Private

  forceReflow() {
    this.element.offsetWidth
  }
}

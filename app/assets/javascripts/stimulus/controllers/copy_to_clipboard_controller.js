import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "copyable" ]
  static classes = [ "success", "supported" ]

  initialize() {
    if (document.queryCommandSupported("copy")) {
      this.element.classList.add(this.supportedClass)
    }
  }

  // Actions

  copy(event) {
    this.selectCopyable()

    if (document.execCommand("copy")) {
      this.element.classList.add(this.successClass)

      if (this.data.has("deselectOnCopy")) {
        this.deselectCopyable()
      }
    }
  }

  selectCopyable(event) {
    this.copyableTarget.select()
    this.copyableTarget.selectionStart = 0
    this.copyableTarget.selectionEnd = this.copyableTarget.value.length
  }

  deselectCopyable(event) {
    window.getSelection().removeAllRanges()
    this.copyableTarget.blur()
  }
}

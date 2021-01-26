import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    if (this.autoselect) {
      this.selectAll()
    }
  }

  // Actions

  select(event) {
    this.selectAll()
  }

  // Private

  selectAll() {
    this.element.selectionStart = 0
    this.element.selectionEnd = this.element.value.length
  }

  get autoselect() {
    return this.element.autofocus
  }
}

import { Controller } from "stimulus";

export default class extends Controller {
  // Actions

  checkAll() {
    this.setAllCheckboxes(true)
  }

  checkNone() {
    this.setAllCheckboxes(false)
  }

  // Private

  setAllCheckboxes(checked) {
    this.checkboxes.forEach((el) => {
      const checkbox = el

      if (!checkbox.disabled) {
        checkbox.checked = checked
      }
    })
  }

  get checkboxes() {
    return this.element.querySelectorAll("input[type=checkbox]")
  }
}

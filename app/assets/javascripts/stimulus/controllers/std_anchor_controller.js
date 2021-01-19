import { Controller } from "stimulus"

export default class extends Controller {
  scroll(event) {
    event.preventDefault()
    const id = event.currentTarget.hash.replace(/^#/, "")
    const anchor = document.getElementById(id)
    anchor.scrollIntoView()
    anchor.focus()
  }
}

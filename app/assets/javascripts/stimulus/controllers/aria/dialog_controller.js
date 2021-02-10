import dialogPolyfill from "https://cdn.skypack.dev/dialog-polyfill"
import wicgInert from "https://cdn.skypack.dev/wicg-inert"
import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    dialogPolyfill.registerDialog(this.element)
    this.observer = new MutationObserver(() => {
      this.element.open ? this.showModal() : this.close()
    })
  }

  connect() {
    this.element.setAttribute("role", "dialog")
    this.element.setAttribute("aria-modal", "true")

    if (this.element.open) {
      this.element.open = false
      this.showModal()
    }
    this.observeMutationsToOpen()
  }

  disconnect() {
    this.observer.disconnect()
  }

  showModal() {
    this.trapFocus()
    this.ensureDialogIsLabelled()
    this.withoutObservingMutations(() => {
      this.element.open = false
      this.element.showModal()
    })
    this.focusFirstInteractiveElement()
  }

  close() {
    this.withoutObservingMutations(() => {
      this.element.open = true
      this.element.close()
      this.releaseFocus()
    })
  }

  // Private

  ensureDialogIsLabelled = () => {
    if (this.element["aria-labelledby"] || this.element["aria-label"]) return

    const heading = this.element.querySelector("h1, h2, h3, h4, h5, h6")

    if (heading) {
      this.element.addEventListener("close", this.removeDialogLabel, { once: true })

      if (heading.id) {
        this.element.setAttribute("aria-labelledby", heading.id)
      } else {
        this.element.setAttribute("aria-label", heading.textContent.trim())
      }
    }
  }

  removeDialogLabel = () => {
    this.element.removeAttribute("aria-labelledby")
    this.element.removeAttribute("aria-label")
  }

  trapFocus = () => {
    this.lastElementWithFocus = document.activeElement
    this.siblingElements.forEach(element => element.inert = true)
  }

  releaseFocus = () => {
    this.siblingElements.forEach(element => element.inert = false)
    this.lastElementWithFocus?.isConnected && this.lastElementWithFocus.focus()

    delete this.lastElementWithFocus
  }

  focusFirstInteractiveElement = () => {
    const visibleElements = [ ...this.element.querySelectorAll("*:not([hidden]):not([type=hidden])") ]
    const firstInteractiveElement = visibleElements.find(({ tabIndex }) => tabIndex > -1)

    firstInteractiveElement?.focus()
  }


  observeMutationsToOpen() {
    this.observer.observe(this.element, { attributeFilter: ["open"] })
  }

  withoutObservingMutations(callback) {
    this.observer.disconnect()
    callback()
    this.observeMutationsToOpen()
  }

  get siblingElements() {
    return [ ...this.element.parentElement.children ].filter(element => element != this.element)
  }
}

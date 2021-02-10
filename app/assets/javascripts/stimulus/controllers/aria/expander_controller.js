import dialogPolyfill from "https://cdn.skypack.dev/dialog-polyfill"
import { Controller } from "stimulus"

export default class extends Controller {
  static get classes() {
    return [ "toggle" ]
  }

  initialize() {
    this.elementStateObserver = new MutationObserver(this.pullStateFromElement)
    this.attributesObserver = new MutationObserver(() => {
      this.elementObserver.disconnect()
      this.elementObserver.observe(this.controlsElement, { attributeFilter: ["open"] })
    })
  }

  connect() {
    if (this.element.hasAttribute("aria-expanded")) {
      this.pushStateToElement(this.expanded)
    } else {
      this.pullStateFromElement()
    }
    this.attributesObserver.observe(this.element, { attributeFilter: ["aria-controls"] })
    this.elementStateObserver.observe(this.controlsElement, { attributeFilter: ["open"] })
  }

  disconnect() {
    this.attributesObserver.disconnect()
    this.elementStateObserver.disconnect()
  }

  toggle() {
    this.element.focus()
    this.expanded = !this.expanded
  }

  // Private

  pushStateToElement = (expanded) => {
    if (this.hasToggleClass) {
      this.controlsElement.classList.toggle(this.toggleClass, expanded)
    } else if ("open" in this.controlsElement) {
      this.controlsElement.open = expanded
    } else {
      this.controlsElement.hidden = !expanded
    }
  }

  pullStateFromElement = () => {
    let isExpanded = false
    if (this.hasToggleClass) {
      isExpanded = this.controlsElement.classList.contains(this.toggleClass)
    } else if ("open" in this.controlsElement) {
      isExpanded = this.controlsElement.open
    } else {
      isExpanded = !this.controlsElement.hidden
    }

    this.element.setAttribute("aria-expanded", isExpanded)
  }

  set expanded(expanded) {
    this.element.setAttribute("aria-expanded", expanded)
    this.pushStateToElement(expanded)
  }

  get expanded() {
    return this.element.getAttribute("aria-expanded") == "true"
  }

  get controlsElement() {
    const id = this.element.getAttribute("aria-controls")
    const element = document.getElementById(id)

    if (/dialog/i.test(element.tagName)) {
      dialogPolyfill.registerDialog(element)
    }

    return element
  }
}

function setAttribute(element, value) {
  return () => element.setAttribute("aria-expanded", value)
}

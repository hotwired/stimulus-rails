import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    this.sortChildren()
    this.observeMutations(this.sortChildren)
  }

  // Private

  observeMutations(callback, target = this.element, options = { childList: true, subtree: true }) {
    const observer = new MutationObserver(mutations => {
      observer.disconnect()
      Promise.resolve().then(start)
      callback.call(this, mutations)
    })
    function start() {
      if (target.isConnected) observer.observe(target, options)
    }
    start()
  }

  sortChildren() {
    const { children } = this
    if (elementsAreSorted(children)) return
    children.sort(compareElements).forEach(this.append)
  }

  get children() {
    return Array.from(this.element.children)
  }

  append = child => this.element.append(child)
}

function elementsAreSorted([ left, ...rights ]) {
  for (const right of rights) {
    if (compareElements(left, right) > 0) return false
    left = right
  }
  return true
}

function compareElements(left, right) {
  return getSortCode(right) - getSortCode(left)
}

function getSortCode(element) {
  return element.getAttribute("data-std--sorted-code") || 0
}

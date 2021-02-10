import { Controller } from "stimulus"

export default class extends Controller {
  initialize() {
    this.observer = new MutationObserver(this.refreshArticles)
  }

  connect() {
    this.refreshArticles()
    this.observer.observe(this.element, { childList: true })
  }

  disconnect() {
    this.observer.disconnect()
  }

  navigate({ ctrlKey, key, target } = event) {
    const article = this.articleElements.find(element => element.contains(target))
    const index = this.articleElements.indexOf(article)
    const firstIndex = 0
    const lastIndex = this.articleElements.length - 1
    let nextArticle

    switch (key) {
      case "PageUp":
        nextArticle = this.articleElements[Math.max(firstIndex, index - 1)]
        break
      case "PageDown":
        nextArticle = this.articleElements[Math.min(lastIndex, index + 1)]
        break
      case "Home":
        if (ctrlKey) nextArticle = this.articleElements[firstIndex]
        break
      case "End":
        if (ctrlKey) nextArticle = this.articleElements[lastIndex]
        break
    }

    if (nextArticle) {
      event.preventDefault()
      nextArticle.focus()
    }
  }

  refreshArticles = () => {
    this.element.setAttribute("aria-setsize", this.articleElements.length + 1)

    this.articleElements.forEach((element, index) => {
      element.setAttribute("tabindex", 0)
      element.setAttribute("aria-posinset", index + 1)
    })
  }

  // Private

  get articleElements() {
    return [ ...this.element.querySelectorAll("* > article, * > [role=article]") ]
  }
}

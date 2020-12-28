import { Application } from "stimulus"

const application = Application.start()
const { controllerAttribute } = application.schema

const loaded = {}

function autoloadControllers(element) {
  controllerNamesInElement(element).forEach(loadController)
}

function controllerNamesInElement(element) {
  const elements = Array.from(element.querySelectorAll(`[${controllerAttribute}]`))
  return elements.map(e => e.getAttribute(controllerAttribute).split(/\s+/).filter(content => content.length)).flat()
}

function register(name, module) {
  if (name in loaded) return

  application.register(name, module.default)

  loaded[name] = true
}

function loadController(name) {
  const filename = name.replace(/--/g, "/").replace(/-/g, "_")

  import(`${filename}_controller`)
    .then(module => register(name, module))
    .catch(error => console.log(`Failed to autoload controller: ${name}`, error))
}

new MutationObserver((mutationsList) => {
  for (const { attributeName, target } of mutationsList) {
    if (attributeName == controllerAttribute && target.hasAttribute(controllerAttribute)) {
      autoloadControllers(target)
    }
  }
}).observe(document.body, { attributeFilter: [controllerAttribute], subtree: true, childList: true })

autoloadControllers(document)

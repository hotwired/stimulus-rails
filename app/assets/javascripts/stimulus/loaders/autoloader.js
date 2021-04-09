import { Application } from "stimulus"

const application = Application.start()
const { controllerAttribute } = application.schema
const registeredControllers = {}

function createTokenList(element, attribute) {
  const tokenList = document.createElement("div").classList
  const tokens = element.getAttribute(attribute) || ""
  tokens.split(/\s+/).filter(content => content.length).forEach(token => tokenList.add(token))

  return tokenList
}

function addToTokenList(element, attribute, value) {
  const tokenList = createTokenList(element, attribute)
  tokenList.add(value)
  element.setAttribute(attribute, tokenList.toString())
}

function removeFromTokenList(element, attribute, value) {
  const tokenList = createTokenList(element, attribute)
  tokenList.remove(value)
  if (tokenList.length) {
    element.setAttribute(attribute, tokenList.toString())
  } else {
    element.removeAttribute(attribute)
  }
}

function autoloadControllersWithin(element) {
  queryControllerNamesWithin(element).forEach(loadController)
}

function queryControllerNamesWithin(element) {
  return Array.from(element.querySelectorAll(`[${controllerAttribute}]`)).map(extractControllerNamesFrom).flat()
}

function extractControllerNamesFrom(element) {
  const tokenList = createTokenList(element, controllerAttribute)
  return Array.from(tokenList).map(name => ({ element, name }))
}

function loadController({ element, name }) {
  addToTokenList(element, "data-stimulus-autoloading", name)
  import(controllerFilename(name))
    .then(module => registerController(name, module))
    .catch(error => console.log(`Failed to autoload controller: ${name}`, error))
    .finally(() => removeFromTokenList(element, "data-stimulus-autoloading", name))
}

function controllerFilename(name) {
  return `${name.replace(/--/g, "/").replace(/-/g, "_")}_controller`
}

function registerController(name, module) {
  if (name in registeredControllers) return

  application.register(name, module.default)
  registeredControllers[name] = true
}

new MutationObserver((mutationsList) => {
  for (const { attributeName, target, type } of mutationsList) {
    switch (type) {
      case "attributes": {
        if (attributeName == controllerAttribute && target.getAttribute(controllerAttribute)) {
          extractControllerNamesFrom(target).forEach(loadController)
        }
      }
      case "childList": {
        autoloadControllersWithin(target)
      }
    }
  }
}).observe(document, { attributeFilter: [controllerAttribute], subtree: true, childList: true })

autoloadControllersWithin(document)

import { Application } from "stimulus"

const application = Application.start()

function autoloadControllers() {
  controllerNamesInDocument().forEach(loadController)
}

function controllerNamesInDocument() {
  return Array.from(document.querySelectorAll("[data-controller]")).map(e => e.attributes["data-controller"].value.split(" ")).flat()
}

function loadController(name) {
  import(`${name}_controller`)
    .then(module => application.register(name, module.default))
    .catch(error => console.log(`Failed to autoload controller: ${name}`))
}

autoloadControllers()
window.addEventListener("turbo:load", autoloadControllers)

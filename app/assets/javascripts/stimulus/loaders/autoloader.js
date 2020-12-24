import { Application } from "stimulus"

const application = Application.start()

function autoload() {
  Array.from(document.querySelectorAll('[data-controller]')).forEach((element) => {
    const controllerNames = element.attributes["data-controller"].value.split(" ")

    controllerNames.forEach((controllerName) => {
      let underscoredControllerName = controllerName.replace(/--/g, "/").replace(/-/g, "_")
      let controllerFilename = `${underscoredControllerName}_controller`

      import(controllerFilename).then((controllerModule) => {
        application.register(controllerName, controllerModule.default)
      }).catch(error => console.log(`Failed to autoload controller: ${controllerName}`))
    })
  })
}

autoload()

window.addEventListener("turbo:load", autoload)

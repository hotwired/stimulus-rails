import { Application } from "stimulus"

const application = Application.start()

function autoload() {
  Array.from(document.querySelectorAll('[data-controller]')).forEach((element) => {
    let controllerName = element.attributes["data-controller"].value
    let controllerFilename = `${controllerName}_controller`

    import(controllerFilename).then((controllerModule) => {
      application.register(controllerName, controllerModule.default)
    }).catch(error => console.log(error))
  })
}

autoload()

window.addEventListener("turbo:load", autoload)

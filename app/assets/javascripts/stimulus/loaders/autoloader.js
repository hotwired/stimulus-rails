import { Application } from "stimulus"

class Autoloader {
  constructor() {
    this.application = Application.start()
  }

  loadControllers() {
    Array.from(document.querySelectorAll('[data-controller]')).forEach((element) => {
      const controllerNames = element.attributes["data-controller"].value.split(" ")
  
      controllerNames.forEach((controllerName) => {
        let underscoredControllerName = controllerName.replace(/--/g, "/").replace(/-/g, "_")
        let controllerFilename = `${underscoredControllerName}_controller`
  
        import(controllerFilename).then((controllerModule) => {
          this.application.register(controllerName, controllerModule.default)
        }).catch(error => console.log(`Failed to autoload controller: ${controllerName}`))
      })
    })
  }
  
  enable() {
    this.loadControllers()
    window.addEventListener("turbo:load", this.loadControllers)
  }
}

const autoloader = new Autoloader()

autoloader.enable()

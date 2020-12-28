import { Application } from "stimulus"

class Autoloader {
  constructor() {
    this.application = Application.start()
  }

  loadControllers() {
    Array.from(document.querySelectorAll('[data-controller]')).forEach((element) => {
      const controllerNames = element.attributes["data-controller"].value.split(" ")
  
      controllerNames.forEach((controllerName) => {
        this.loadController(controllerName).catch(error => console.log(`Failed to autoload controller: ${controllerName}`))
      })
    })
  }
  
  async loadController(name) {
    try {
      const underscoredControllerName = name.replace(/--/g, "/").replace(/-/g, "_")

      const module = await import(`${underscoredControllerName}_controller`)
      this.application.register(name, module.default)
    } catch(error) {
      throw `Failed to autoload controller: ${name}`
    }
  }
  
  enable() {
    this.loadControllers()
    window.addEventListener("turbo:load", this.loadControllers)
  }
}

const autoloader = new Autoloader()

autoloader.enable()

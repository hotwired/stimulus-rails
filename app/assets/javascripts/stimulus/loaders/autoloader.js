import { Application } from "stimulus"

export class Autoloader {
  static get controllerAttribute() {
    return "data-controller"
  }

  static get controllersSelector() {
    return `[${this.controllerAttribute}]`
  }

  constructor() {
    this.application = Application.start()
  }

  loadControllers() {
    return Promise.allSettled(
      Array.from(document.querySelectorAll('[data-controller]')).flatMap((element) => {
        const controllerNames = element.attributes["data-controller"].value.split(" ")

        return controllerNames.map((controllerName) => this.loadController(controllerName))
      })
    ).then((values) => {
      values.filter((value) => value.status === "rejected").forEach((value) => {
        this.application.logger.error(value.reason)
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

import { Application } from "@hotwired/stimulus"

function registerControllersFrom(under) {
  const paths = Object.keys(importmap).filter(path => path.match(new RegExp(`^${under}/.*_controller$`)))
  paths.forEach(path => registerControllerFromPath(path, under))
}

function registerControllerFromPath(path, under) {
  const name = path.replace(`${under}/`, "").replace("_controller", "").replace(/\//g, "--").replace(/_/g, "-")

  import(path)
    .then(module => application.register(name, module.default))
    .catch(error => console.log(`Failed to register controller: ${name} (${path})`, error))
}

const application = Application.start()
const importmap = JSON.parse(document.querySelector("script[type=importmap]").text).imports

registerControllersFrom("controllers")

export { application, registerControllersFrom }

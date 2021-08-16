import { Application } from "@hotwired/stimulus"

const application = Application.start()

const importmap = JSON.parse(document.querySelector("script[type=importmap]").text)
const importedControllerPaths = Object.keys(importmap.imports).filter((e) => e.match("controllers/"))

importedControllerPaths.forEach(function(path) {
  const name = path.replace("controllers/", "").replace("_controller", "").replace("/", "--").replace("_", "-")

  import(path)
    .then(module => application.register(name, module.default))
    .catch(error => console.log(`Failed to autoload controller: ${name}`, error))
})

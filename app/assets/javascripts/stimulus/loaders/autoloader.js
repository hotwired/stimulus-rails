import { Application } from "stimulus"

const controllerFilename = name => `${name.replace(/--/g, "/").replace(/-/g, "_")}_controller`

const application = new Application()
application.register_autoloader((name, app) => {
  import(controllerFilename(name))
    .then(module => app.register(name, module.default))
    .catch(error => console.log(`Failed to autoload controller: ${name}`, error))
})
application.start()

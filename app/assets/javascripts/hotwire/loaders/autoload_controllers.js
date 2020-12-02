function autoload() {
  Array.from(document.querySelectorAll('[data-controller]')).forEach((element) => {
    let controllerName = element.attributes["data-controller"].value
    let controllerFilename = `${controllerName}_controller`

    import(`controllers/${controllerFilename}`).then((controllerModule) => {
      Stimulus.register(controllerName, controllerModule.default)
    }).catch(error => console.log(error))
  })
}

autoload()

window.addEventListener("turbolinks:load", autoload)

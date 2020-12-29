import { ApplicationTestCase } from "../../application_test_case.js"
import { Autoloader } from "../../../../app/assets/javascripts/stimulus/loaders/autoloader.js"

export class AutoloaderTests extends ApplicationTestCase {
  Logger = class {
    constructor() {
      this.logs = []
      this.warnings = []
      this.errors = []
    }

    log(message) {
      this.logs.push(message)
    }

    warn(message) {
      this.warnings.push(message)
    }

    error(message) {
      this.errors.push(message)
    }
  }

  async setup() {
    this.autoloader = new Autoloader()
    this.autoloader.application.logger = new this.Logger()
  }

  async "test loads controller"() {
    this.assert.strictEqual(await this.autoloader.loadController("hello"), undefined)
  }

  "test fails to load missing controller"() {
    this.assert.rejects(this.autoloader.loadController("nonexistent"))
  }

  async "test loads controller with multi-word name"() {
    this.assert.strictEqual(await this.autoloader.loadController("multi-word"), undefined)
  }

  async "test loads namespaced controller"() {
    this.assert.strictEqual(await this.autoloader.loadController("some-namespace--another-namespace--hello"), undefined)
  }

  async "test autoloads controller for a single element"() {
    this.fixtureHTML = `<div data-controller="hello"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test autoloads multiple controllers for a single element"() {
    this.fixtureHTML = `<div data-controller="hello goodbye"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test fails to autoload nonexistent controllers for a single element"() {
    this.fixtureHTML = `<div data-controller="hello nonexistent"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test autoloads controllers for multiple elements"() {
    this.fixtureHTML = `<div data-controller="hello"></div><div data-controller="goodbye"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test fails to autoload nonexistent controllers for multiple elements"() {
    this.fixtureHTML = `<div data-controller="hello"></div><div data-controller="nonexistent"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test autoloads controller for specified elements"() {
    this.fixtureHTML = `<div data-controller="hello"></div><div data-controller="nonexistent"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers([this.fixtureElement.firstChild])
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
    this.fixtureHTML = `<div data-controller="hello"></div><div data-controller="nonexistent"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers([this.fixtureElement.lastChild])
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test reloads controllers given attribute mutations"() {
    this.fixtureHTML = `<div data-controller="hello"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.fixtureElement.firstChild.dataset.controller = "hello goodbye"
    const mutation = { target: this.fixtureElement.firstChild, attributeName: "data-controller", type: "attributes" }
    await this.autoloader.reloadControllers([mutation])
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
    this.fixtureElement.firstChild.dataset.controller = "hello nonexistent"
    await this.autoloader.reloadControllers([mutation])
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test reloads controllers given child list mutations"() {
    this.fixtureHTML = `<div data-controller="hello"></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers(Array.from(this.fixtureElement.children))
    this.fixtureHTML = `<span id="loading-target" data-controller="hello"></span>`
    await this.renderFixture()
    const mutation = { target: this.fixtureElement, addedNodes: this.fixtureElement.childNodes, type: "childList" }
    await this.autoloader.reloadControllers([mutation])
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
    this.fixtureHTML = `<p id="loading-target" data-controller="nonexistent"></p>`
    await this.renderFixture()
    await this.autoloader.reloadControllers([mutation])
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test reloads controllers on attribute changes"() {
    this.fixtureHTML = `<div id="loading-target" data-controller="hello"></div>`
    await this.renderFixture()
    const element = this.findElement("#loading-target")
    await new Promise((resolve) => {
      this.autoloader.observerCallback = (mutationList) => {
        this.autoloader.reloadControllers(mutationList).then((result) => {
          if (result.length > 0) {
            resolve()
          }
        })
      }
      this.autoloader.enable().then(() => element.dataset.controller = "hello goodbye")
    })
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
    await new Promise((resolve) => {
      this.autoloader.observerCallback = (mutationList) => {
        this.autoloader.reloadControllers(mutationList).then((result) => {
          if (result.length > 0) {
            resolve()
          }
        })
      }
      this.autoloader.enable().then(() => element.dataset.controller = "hello nonexistent")
    })
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test reloads controllers on node additions"() {
    await new Promise((resolve) => {
      this.autoloader.observerCallback = (mutationList) => {
        this.autoloader.reloadControllers(mutationList).then((result) => {
          if (result.length > 0) {
            resolve()
          }
        })
      }
      this.autoloader.enable().then(() => this.fixtureElement.innerHTML = `<div data-controller="hello"></div>`)
    })
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
    await new Promise((resolve) => {
      this.autoloader.observerCallback = (mutationList) => {
        this.autoloader.reloadControllers(mutationList).then((result) => {
          if (result.length > 0) {
            resolve()
          }
        })
      }
      this.autoloader.enable().then(() => this.fixtureElement.innerHTML = `<p data-controller="nonexistent"></p>`)
    })
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }
}

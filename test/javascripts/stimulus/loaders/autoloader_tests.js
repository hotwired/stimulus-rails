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
    this.fixtureHTML = `<div data-controller='hello'></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers()
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test autoloads multiple controllers for a single element"() {
    this.fixtureHTML = `<div data-controller='hello goodbye'></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers()
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test fails to autoload nonexistent controllers for a single element"() {
    this.fixtureHTML = `<div data-controller='hello nonexistent'></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers()
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }

  async "test autoloads controllers for multiple elements"() {
    this.fixtureHTML = `<div data-controller='hello'></div><div data-controller='goodbye'></div>`
    await this.renderFixture()
    await this.autoloader.loadControllers()
    this.assert.strictEqual(this.autoloader.application.logger.errors.length, 0)
  }

  async "test fails to autoload nonexistent controllers for multiple elements"() {
    this.fixtureHTML = "<div data-controller='hello'></div><div data-controller='nonexistent'></div>"
    await this.renderFixture()
    await this.autoloader.loadControllers()
    this.assert.deepEqual(this.autoloader.application.logger.errors, ["Failed to autoload controller: nonexistent"])
  }
}

import { DOMTestCase } from "@stimulus/test"

export class ApplicationTestCase extends DOMTestCase {
  static get testPropertyNames() {
    return Object.getOwnPropertyNames(this.prototype).filter(name => name.match(/^(skip|test|todo) /))
  }
}

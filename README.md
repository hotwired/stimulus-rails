# Stimulus for Rails

[Stimulus](https://stimulus.hotwired.dev) is a JavaScript framework with modest ambitions. It doesn’t seek to take over your entire front-end in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine. Stimulus pairs beautifully with Turbo to provide a complete solution for fast, compelling applications with a minimal amount of effort. Together they form the core of [Hotwire](https://hotwired.dev).

Stimulus for Rails makes it easy to use this modest framework with the asset pipeline and ES6/ESM in the browser. It relies on either `importmap-rails` to make Stimulus available via ESM or a node-capable Rails (like via `jsbundling-rails`) to include Stimulus in the bundle. Make sure to install one of these first!


## Installation

1. Add the `stimulus-rails` gem to your Gemfile: `gem 'stimulus-rails'`
2. Run `./bin/bundle install`.
3. Run `./bin/rails stimulus:install`

The installer will automatically detect whether you're using an [import map](https://github.com/rails/importmap-rails) or [JavaScript bundler](https://github.com/rails/jsbundling-rails) to manage your application's JavaScript. If you're using an import map, the Stimulus dependencies will be pinned to the versions of the library included with this gem. If you're using node, yarn will add the dependencies to your `package.json` file.


## Usage

The installer amends your JavaScript entry point at `app/javascript/application.js` to import the `app/javascript/controllers/index.js` file, which is responsible for setting up your Stimulus application and registering your controllers.

With an import-mapped application, controllers are automatically pinned and registered based on the file structure. With a node application, controllers need to be imported and registered directly in the index.js file, but this is done automatically using either the Stimulus generator (`./bin/rails generate stimulus [controller]`) or the dedicated `stimulus:manifest:update` task. Either will overwrite the `controllers/index.js` file.

You're encouraged to use the generator to add new controllers like so:

```javascript
// Run "./bin/rails g stimulus hello" to create the file and update the index, then amend:

// app/assets/javascripts/controllers/hello_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects with data-controller="hello"
export default class extends Controller {
  static targets = [ "name", "output" ]

  greet() {
    this.outputTarget.textContent = `Hello, ${this.nameTarget.value}!`
  }
}
```

And it'll be activated and registered automatically when encountering the data-controller attribute in your DOM:

```html
<div data-controller="hello">
  <input data-hello-target="name" type="text">

  <button data-action="click->hello#greet">
    Greet
  </button>

  <span data-hello-target="output">
  </span>
</div>
```

That's it!


## License

Stimulus for Rails is released under the [MIT License](https://opensource.org/licenses/MIT).

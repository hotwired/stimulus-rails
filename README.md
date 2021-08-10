# Stimulus for Rails

[Stimulus](https://stimulus.hotwired.dev) is a JavaScript framework with modest ambitions. It doesn’t seek to take over your entire front-end in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine. Stimulus pairs beautifully with Turbo to provide a complete solution for fast, compelling applications with a minimal amount of effort. Together they form the core of [Hotwire](https://hotwired.dev).

Stimulus for Rails makes it easy to use this modest framework with the asset pipeline and ES6/ESM in the browser. It relies on `importmap-rails` to make stimulus available via ESM. Make sure to install this first!


## Installation

1. Add the `stimulus-rails` gem to your Gemfile: `gem 'stimulus-rails'`
2. Run `./bin/bundle install`.
3. Run `./bin/rails stimulus:install`

If using the asset pipeline to manage JavaScript, the last command will:

1. Create an example controller in `app/assets/javascripts/controllers/hello_controller.js`.
2. Append `import "@hotwired/stimulus-autoloader"` to your `app/assets/javascripts/application.js` entrypoint.

Make sure you've already installed `importmap-rails` and that it's referenced before `stimulus-rails` (or `hotwire-rails`) in your Gemfile.

If using Webpacker to manage JavaScript, the last command will:

1. Import the controllers directory in the application pack.
2. Create a controllers directory at `app/javascripts/controllers`.
3. Create an example controller in `app/javascripts/controllers/hello_controller.js`.
4. Install the Stimulus NPM package.


## Usage

With the installation done, you'll automatically have activated Stimulus through the controller autoloader. You can now easily add new Stimulus controllers that'll be loaded via ESM dynamic imports.

For example, a more advanced `hello_controller` could look like this:

```javascript
// app/assets/javascripts/controllers/hello_controller.js
import { Controller } from "stimulus"

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

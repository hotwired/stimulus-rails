# Stimulus for Rails

[Stimulus](https://stimulus.hotwire.dev) is a JavaScript framework with modest ambitions. It doesn’t seek to take over your entire front-end in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine. Stimulus pairs beautifully with Turbo to provide a complete solution for fast, compelling applications with a minimal amount of effort.

Stimulus for Rails makes it easy to use this modest framework with the asset pipeline and ES6/ESM in the browser. It uses the 7kb es-module-shim to provide [importmap](https://github.com/WICG/import-maps) support for all ES6-compatible browsers. This means you can develop and deploy without using any bundling or transpiling at all! Far less complexity, no waiting for compiling.

If you want to use Stimulus with a bundler, you should use [Webpacker](https://github.com/rails/webpacker) instead. This gem is purely intended for those who wish to use Stimulus with the asset pipeline using ESM in the browser.

## Installation

1. Add the `stimulus-rails` gem to your Gemfile: `gem 'stimulus-rails'`
2. Run `./bin/bundle install`.
3. Run `./bin/rails stimulus:install`

If using the asset pipeline to manage JavaScript, the last command will:

1. Create an example controller in `app/assets/javascripts/controllers/hello_controller.js`.
2. Append the include tags to the `<head>` of your `app/views/layouts/application.html.erb`.
3. Initialize your `importmap.json` in `app/assets/javascripts/importmap.json.erb`.
4. Ensure JavaScript is included in your `app/assets/config/manifest.js` file for compilation.

If using Webpacker to manage JavaScript, the last command will:

1. Import the controllers directory in the application pack.
2. Create a controllers directory at `app/javascripts/controllers`.
3. Create an example controller in `app/javascripts/controllers/hello_controller.js`.
4. Install the Stimulus NPM package.

## Usage

With the Stimulus include tags added, you'll automatically have activated Stimulus through the controller autoloader. You can now easily add new Stimulus controllers that'll be loaded via ESM dynamic imports.

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

You can add additional libraries needed by your controllers in `app/assets/javascripts/libraries` using the `library@1.0.0.js` naming convention. These libraries will be added to the dynamically generated [importmap](https://github.com/WICG/import-maps) (a shim is included with the `stimulus_include_tags`), so you can reference `cookies@0.5.6.js` as `import Cookie from "cookies"`.

The libraries must be made for ESM. See https://skypack.dev where you can either directly reference libraries or download them and use them with the ESM conversion.


## License

Stimulus for Rails is released under the [MIT License](https://opensource.org/licenses/MIT).

# Stimulus for Rails

[Stimulus](https://stimulus.hotwired.dev) is a JavaScript framework with modest ambitions. It doesn’t seek to take over your entire front-end in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine. Stimulus pairs beautifully with Turbo to provide a complete solution for fast, compelling applications with a minimal amount of effort. Together they form the core of [Hotwire](https://hotwired.dev).

Stimulus for Rails makes it easy to use this modest framework with both import-mapped and JavaScript-bundled apps. It relies on either `importmap-rails` to make Stimulus available via ESM or a Node-capable Rails (like via `jsbundling-rails`) to include Stimulus in the bundle. Make sure to install one of these first!


## Installation

This gem is automatically configured for applications made with Rails 7+ (unless `--skip-hotwire` is passed to the generator). But if you're on Rails 6, you can install it manually with:

1. Add the `stimulus-rails` gem to your Gemfile: `gem 'stimulus-rails'`
2. Run `./bin/bundle install`.
3. Run `./bin/rails stimulus:install`

The installer will automatically detect whether you're using an [import map](https://github.com/rails/importmap-rails) or [JavaScript bundler](https://github.com/rails/jsbundling-rails) to manage your application's JavaScript. If you're using an import map, the Stimulus dependencies will be pinned to the versions of the library included with this gem. If you're using Node, yarn will add the dependencies to your `package.json` file.

The installer amends your JavaScript entry point at `app/javascript/application.js` to import the `app/javascript/controllers/index.js` file, which is responsible for setting up your Stimulus application and registering your controllers.


## Usage with import map

With an import-mapped application, controllers are automatically pinned and registered based on the file structure. The installer will amend your `config/importmap.rb` to configure this such that all controllers in `app/javascript/controllers` are pinned.

By default, your application will be setup to eager load all the controllers mentioned in your import map under "controllers". This works well together with preloading in the import map when you have a modest number of controllers.

If you have a lot of controllers, you may well want to lazy load them instead. This can be done by changing from `eagerLoadControllersFrom` to `lazyLoadControllersFrom` in your `app/javascript/controllers/index.js` file.

When lazy loading, controllers are not loaded until their data-controller identifier is encountered in the DOM.


## Usage with JavaScript bundler

With an application using a JavaScript bundler, controllers need to be imported and registered directly in the index.js file. But this can be done automatically using either the Stimulus generator (`./bin/rails generate stimulus [controller]`) or the dedicated `stimulus:manifest:update` task. Either will overwrite the `controllers/index.js` file.

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


## License

Stimulus for Rails is released under the [MIT License](https://opensource.org/licenses/MIT).

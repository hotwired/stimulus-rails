# Hotwire for Rails

Hotwire is an alternative approach to building modern web applications without using much JavaScript by sending HTML instead of JSON over the wire. This makes for fast first-load pages, keeps template rendering on the server, and allows for a simpler, more productive development experience in any programming language, without sacrificing any of the speed or responsiveness associated with a traditional single-page application.

The heart of Hotwire is Turbo. A set of complimentary techniques for speeding up page changes and form submissions, dividing complex pages into components, and providing partial page updates over WebSocket. All without writing any JavaScript at all. And designed from the start to integrate perfectly with native hybrid applications for iOS and Android.

While Turbo usually takes care of at least 80% of the interactivity that traditionally would have required JavaScript, there are still cases where a dash of custom code is required. Stimulus makes this easy with a HTML-centric approach to state and wiring.

Hotwire for Rails makes both of these JavaScript libraries available using the asset pipeline, and leans on the native support in modern browsers for ES6 and ESM. This allows you to entirely skip a JavaScript build and bundling pipeline (such as Webpack). You don't even have to have node or yarn configured for your app!

## Installation

Add the gem and install the gem:

```
gem 'hotwire-rails'
$ ./bin/bundle
```

Add the hotwire include tags to the `<head>` of your application.html.erb:

```
<%= hotwire_include_tags %>
```

## Usage

Once the Hotwire include tags are added, you'll automatically have activated Turbo. So page changes and form submissions will be accelerated. You'll have access to Turbo Frames and Turbo Updates. And you can easily add new Stimulus controllers that'll be autoloaded via ESM dynamic imports when the `data-controller` tag appears in your DOM.

You can add a Stimulus controller for pre- or autoloading by creating a file in `app/assets/javascripts/controllers`, like:

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
  <input data-target="hello.name" type="text">

  <button data-action="click->hello#greet">
    Greet
  </button>

  <span data-target="hello.output">
  </span>
</div>
```

That's it!

You can add additional libraries needed by your controllers in `app/assets/javascripts/libraries` using the `library@1.0.0.js` naming convention. These libraries will be added to the dynamically generated [importmap](https://github.com/WICG/import-maps) (a shim is included with the `hotwire_include_tags`), so you can reference `cookies@0.5.6.js` as `import Cookie from "cookies"`.

The libraries must be made for ESM. See https://skypack.dev where you can either directly reference libraries or download them and use them with the ESM conversion.

## License

Hotwire for Rails is released under the [MIT License](https://opensource.org/licenses/MIT).

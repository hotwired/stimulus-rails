module Hotwire::HotwireHelper
  def hotwire_include_tag
    [
      javascript_include_tag("hotwire/libraries/es-module-shims@0.7.1", type: "module"),
      tag.script(type: "importmap-shim", src: asset_path("hotwire/importmap.json")),
      javascript_include_tag("hotwire/frameworks/stimulus@2", type: "module-shim"),
      javascript_include_tag("hotwire/frameworks/turbo@7", type: "module-shim"),
      javascript_include_tag("hotwire/loaders/preload_controllers", type: "module-shim")
    ].join("\n").html_safe
  end
end

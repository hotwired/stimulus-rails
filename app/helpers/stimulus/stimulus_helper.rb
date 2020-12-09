module Stimulus::StimulusHelper
  def stimulus_include_tags(loading = :autoload)
    [
      javascript_include_tag("stimulus/libraries/es-module-shims", type: "module"),
      tag.script(type: "importmap-shim", src: asset_path("importmap.json")),
      javascript_include_tag("stimulus/libraries/stimulus", type: "module-shim"),
      javascript_include_tag("stimulus/loaders/#{loading}_controllers", type: "module-shim")
    ].join("\n").html_safe
  end
end

module Stimulus::StimulusHelper
  def stimulus_include_tags(importmap = "importmap.json")
    safe_join [
      javascript_include_tag("stimulus/libraries/es-module-shims", type: "module"),
      tag.script(src: asset_path(importmap), type: "importmap-shim"),
      javascript_include_tag("stimulus/libraries/stimulus", type: "module-shim"),
      javascript_include_tag("stimulus/loaders/autoloader", type: "module-shim")
    ], "\n"
  end
end

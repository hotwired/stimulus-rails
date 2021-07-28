module Stimulus::StimulusHelper
  def stimulus_include_tags(importmap = "importmap.json")
    safe_join [
      javascript_include_tag("stimulus/libraries/es-module-shims", type: "module"),
      javascript_include_tag("stimulus/libraries/stimulus", type: "module"),
      javascript_include_tag("stimulus/loaders/autoloader", type: "module")
      tag.script(src: asset_path(importmap), type: "importmap-shim"),
    ], "\n"
  end
end

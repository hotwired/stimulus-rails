module Stimulus::StimulusHelper
  def stimulus_include_tags(importmap = "importmap.json")
    safe_join [
      javascript_include_tag("stimulus/libraries/es-module-shims", type: "module"),
      tag.script(type: "importmap-shim", src: asset_path(importmap)),
      javascript_include_tag("stimulus/libraries/stimulus", type: "module"),
      javascript_include_tag("stimulus/loaders/autoloader", type: "module")
    ], "\n"
  end
end

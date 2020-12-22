# frozen_string_literal: true

module Stimulus::StimulusHelper
  def stimulus_include_tags
    [
      javascript_include_tag("stimulus/libraries/es-module-shims", type: "module"),
      tag.script(type: "importmap-shim", src: asset_path("importmap.json")),
      javascript_include_tag("stimulus/libraries/stimulus", type: "module-shim"),
      javascript_include_tag("stimulus/loaders/autoloader", type: "module-shim")
    ].join("\n").html_safe
  end
end

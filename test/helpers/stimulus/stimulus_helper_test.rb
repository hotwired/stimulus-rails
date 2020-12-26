require 'test_helper'

class Stimulus::StimulusHelperTest < ActionView::TestCase
  tests Stimulus::StimulusHelper

  def test_stimulus_include_tags
    assert_dom_equal <<~HTML.strip, stimulus_include_tags
      <script src="/javascripts/stimulus/libraries/es-module-shims.js" type="module"></script>
      <script type="importmap-shim" src="/importmap.json"></script>
      <script src="/javascripts/stimulus/libraries/stimulus.js" type="module-shim"></script>
      <script src="/javascripts/stimulus/loaders/autoloader.js" type="module-shim"></script>
    HTML
  end
end

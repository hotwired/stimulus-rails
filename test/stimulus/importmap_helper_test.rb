require "test_helper"

class Stimulus::ImportmapHelperTest < ActionView::TestCase
  test "recursively adds files to importmap" do
    assert_equal <<~EXPECTED.strip, importmap_list_from(file_fixture("controllers"))
      "goodbye_controller": "/controllers/goodbye_controller.js",
      "hello_controller": "/controllers/hello_controller.js",
      "multi_word_controller": "/controllers/multi_word_controller.js",
      "some_namespace/another_namespace/hello_controller": "/controllers/some_namespace/another_namespace/hello_controller.js"
    EXPECTED
  end

  test "recursively adds files with a pattern to importmap" do
    assert_equal <<~EXPECTED.strip, importmap_list_from([file_fixture("components"), "_controller.js"])
      "goodbye_controller": "/components/goodbye_controller.js",
      "hello_controller": "/components/hello_controller.js",
      "multi_word_controller": "/components/multi_word_controller.js",
      "some_namespace/hello_controller": "/components/some_namespace/hello_controller.js"
    EXPECTED
  end

  test "importmap including folder with nothing to load" do
    assert_equal <<~EXPECTED.strip, importmap_list_with_stimulus_from(file_fixture("nothing_to_load"))
      "stimulus": "/stimulus/libraries/stimulus"
    EXPECTED
  end

  test "importmap including folder with nothing to load because no match patterns" do
    assert_equal <<~EXPECTED.strip, importmap_list_with_stimulus_from([file_fixture("components"), "_controller.es6"])
      "stimulus": "/stimulus/libraries/stimulus"
    EXPECTED
  end

  test "importmap including both folders with controllers and nothing to load" do
    assert_equal <<~EXPECTED.strip, importmap_list_with_stimulus_from(file_fixture("controllers"), file_fixture("nothing_to_load"))
      "stimulus": "/stimulus/libraries/stimulus",
      "goodbye_controller": "/controllers/goodbye_controller.js",
      "hello_controller": "/controllers/hello_controller.js",
      "multi_word_controller": "/controllers/multi_word_controller.js",
      "some_namespace/another_namespace/hello_controller": "/controllers/some_namespace/another_namespace/hello_controller.js"
    EXPECTED
  end
end

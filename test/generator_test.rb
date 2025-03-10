require "test_helper"
require "generators/stimulus/stimulus_generator"

module Rails
  def self.root
    path = File.expand_path("../tmp", __dir__)

    Pathname.new path
  end
end

class StimulusGeneratorTest < Rails::Generators::TestCase
  tests StimulusGenerator
  destination Rails.root
  setup :prepare_destination

  test "generating a simple controller" do
    run_generator ["hello"]

    assert_file "app/javascript/controllers/hello_controller.js", /data-controller="hello"/
  end

  test "generating with camelized name" do
    run_generator ["HelloWorld"]

    assert_file "app/javascript/controllers/hello_world_controller.js", /data-controller="hello-world"/
  end


  test "generating with camelized name and lower case first letter" do
    run_generator ["helloWorld"]

    assert_file "app/javascript/controllers/hello_world_controller.js", /data-controller="hello-world"/
  end

  test "generating with kebab-cased name" do
    run_generator ["hello-world"]

    assert_file "app/javascript/controllers/hello_world_controller.js", /data-controller="hello-world"/
  end

  test "generating with underscored name" do
    run_generator ["hello_world"]

    assert_file "app/javascript/controllers/hello_world_controller.js", /data-controller="hello-world"/
  end

  test "generating with namespaced name" do
    run_generator ["hello/world"]

    assert_file "app/javascript/controllers/hello/world_controller.js", /data-controller="hello--world"/
  end

  test "generating with namespaced and camelized name" do
    run_generator ["Hello/HappyWorld"]

    assert_file "app/javascript/controllers/hello/happy_world_controller.js", /data-controller="hello--happy-world"/
  end

  test "generating with namespaced and camelized name with a lower case first letter" do
    run_generator ["hello/happyWorld"]

    assert_file "app/javascript/controllers/hello/happy_world_controller.js", /data-controller="hello--happy-world"/
  end

  test "generating with namespaced and kebab-cased name" do
    run_generator ["hello/happy-world"]

    assert_file "app/javascript/controllers/hello/happy_world_controller.js", /data-controller="hello--happy-world"/
  end

  test "generating with namespaced and underscored name" do
    run_generator ["hello/happy_world"]

    assert_file "app/javascript/controllers/hello/happy_world_controller.js", /data-controller="hello--happy-world"/
  end

  test "generating with ruby namespacing" do
    run_generator ["Hello::RubyWorld"]

    assert_file "app/javascript/controllers/hello/ruby_world_controller.js", /data-controller="hello--ruby-world"/
  end

  test "removes tailing 'controller'" do
    run_generator ["HelloController"]

    assert_file "app/javascript/controllers/hello_controller.js", /data-controller="hello"/
  end

  test "removes tailing 'controller' in namespaced string" do
    run_generator ["Hello/WorldController"]

    # Access the generator's class variables
    # Make assertions against the config
    # assert_equal expected_value, config[:some_key]

    assert_file "app/javascript/controllers/hello/world_controller.js", /data-controller="hello--world"/
  end

  test "writes controller to a custom path if specified" do
    custom_path = "app/custom/controllers"
    run_generator ["Hello", "--controllers-path=#{custom_path}"]

    assert_file "#{custom_path}/hello_controller.js", /data-controller="hello/
  end

  test "fails if controllers path is empty" do
    assert_raises RuntimeError, "controllers-path cannot be empty" do
      run_generator ["Hello", "--controllers-path="]
    end
  end

  test "fails if controllers path is an absolute path" do
    absolute_path = "/mypath"
    assert_raises RuntimeError, "controllers-path cannot be an absolute path: #{absolute_path}" do
      run_generator ["Hello", "--controllers-path=#{absolute_path}"]
    end
  end
end

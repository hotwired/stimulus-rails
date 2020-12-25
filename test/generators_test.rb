# frozen_string_literal: true

require 'rails'
require 'rails/generators/test_case'
require 'generators/stimulus/controller_generator'

class GeneratorsTest < Rails::Generators::TestCase
  destination Rails.root
  tests Stimulus::ControllerGenerator

  setup :prepare_destination

  def destination_root
    tmp_path "foo_bar"
  end

  def tmp_path(*args)
    @tmp_path ||= File.realpath(Dir.mktmpdir)
    File.join(@tmp_path, *args)
  end

  arguments %w(message)

  test "should invoke haml engine" do
    run_generator
    assert_file "app/assets/javascripts/controllers/message_controller.js"
  end
end

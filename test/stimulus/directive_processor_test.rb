# frozen_string_literal: true

require "test_helper"

module Stimulus
  class DirectiveProcessorTest < ActionView::TestCase
    test "map directive adds asset to importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: "//= map controllers/hello_controller\n//= map controllers/loading_controller",
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "map directory directive adds assets to importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: "//= map_directory ./controllers",
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}","controllers/message_rendering_controller":"#{asset_path("controllers/message_rendering_controller")}","controllers/not_js":"#{asset_path("controllers/not_js")}"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "map directory directive with accept adds assets to importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: "//= map_directory ./controllers .js",
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}","controllers/message_rendering_controller":"#{asset_path("controllers/message_rendering_controller")}"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "map tree directive with accept adds assets to importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: "//= map_tree ./controllers .js",
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}","controllers/message_rendering_controller":"#{asset_path("controllers/message_rendering_controller")}","controllers/namespace/message_rendering_controller":"#{asset_path("controllers/namespace/message_rendering_controller")}"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "map directive adds asset to static importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: %Q(//= map controllers/hello_controller\n//= map controllers/loading_controller\n{"imports":{"foo":"bar"}}),
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}","foo":"bar"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "static importmap overrides map directives" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: %Q(//= map controllers/hello_controller\n//= map controllers/loading_controller\n{"imports":{"controllers/hello_controller":"bar"}}),
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"bar","controllers/loading_controller":"#{asset_path("controllers/loading_controller")}"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end

    test "handles scopes in static importmap" do
      environment = Sprockets::Environment.new(Rails.root)
      environment.append_path("app/assets/javascripts")
      environment.context_class.class_eval do
        include ActionView::Helpers::AssetUrlHelper
      end
      input = {
        environment: environment,
        filename: "test/dummy/app/assets/javascripts/foo.json.importmap",
        content_type: 'application/importmap+json',
        data: %Q(//= map controllers/hello_controller\n{"imports":{},"foo":{"bar":"baz"}}),
        metadata: {},
        cache: Sprockets::Cache.new
      }
      output = %Q({"imports":{"controllers/hello_controller":"#{asset_path("controllers/hello_controller")}"},"foo":{"bar":"baz"}})
      assert_equal output, DirectiveProcessor.call(input)[:data]
    end
  end
end

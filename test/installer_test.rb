require 'test_helper'

class InstallerTest < ActiveSupport::TestCase
  include RailsAppHelpers

  test "installer" do
    with_new_rails_app do
      if Rails::VERSION::MAJOR >= 7 && File.read("Gemfile").match?(/importmap-rails/)
        run_command("bin/rails", "importmap:install")
      end
      _out, _err = run_command("bin/rails", "stimulus:install")

      assert_match %r(import "(./)?controllers"), File.read("app/javascript/application.js")
      assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/application.js"), File.read("app/javascript/controllers/application.js")
      assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/hello_controller.js"), File.read("app/javascript/controllers/hello_controller.js")

      if Rails::VERSION::MAJOR >= 7
        assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/index_for_importmap.js"), File.read("app/javascript/controllers/index.js")
        assert_match %(pin "@hotwired/stimulus", to: "stimulus.min.js"), File.read("config/importmap.rb")
        assert_match %(pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"), File.read("config/importmap.rb")
        assert_match %(pin_all_from "app/javascript/controllers", under: "controllers"), File.read("config/importmap.rb")
      else
        assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/index_for_node.js"), File.read("app/javascript/controllers/index.js")
        assert_match "@hotwired/stimulus", File.read("package.json")
        assert_match "@hotwired/stimulus", File.read("yarn.lock")
      end
    end
  end

  test "installer with no javascript" do
    with_new_rails_app %w[--skip-javascript] do
      out, _err = run_command("bin/rails", "stimulus:install")

      assert_match "You must either be running with node (package.json) or importmap-rails (config/importmap.rb) to use this gem.", out
    end
  end

  test "installer with pre-existing application.js" do
    with_new_rails_app do
      if Rails::VERSION::MAJOR >= 7 && File.read("Gemfile").match?(/importmap-rails/)
        run_command("bin/rails", "importmap:install")
      end
      File.write("app/javascript/application.js", "// pre-existing")
      _out, _err = run_command("bin/rails", "stimulus:install")

      assert_match "// pre-existing", File.read("app/javascript/application.js")
    end
  end

  if Gem::Version.new(Rails.version) >= Gem::Version.new("7.1")
    test "installer with bun" do
      with_new_rails_app %w[--javascript=bun] do
        run_command("bin/rails", "javascript:install:bun")
        _out, _err = run_command("bin/rails", "stimulus:install")

        assert_match %r(import "(./)?controllers"), File.read("app/javascript/application.js")
        assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/application.js"), File.read("app/javascript/controllers/application.js")
        assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/hello_controller.js"), File.read("app/javascript/controllers/hello_controller.js")

        assert_equal File.read("#{__dir__}/../lib/install/app/javascript/controllers/index_for_node.js"), File.read("app/javascript/controllers/index.js")

        assert_match "@hotwired/stimulus", File.read("package.json")
      end
    end
  end

  private
    def with_new_rails_app(options=[], &block)
      super do
        if Dir.exist?("app/javascript") && !File.exist?("app/javascript/application.js")
          File.write("app/javascript/application.js", <<~JS, mode: "a+")
            import "./controllers"
          JS
        end

        block.call
      end
    end
end
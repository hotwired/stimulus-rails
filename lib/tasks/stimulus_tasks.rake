def run_stimulus_install_template(path) system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/#{path}.rb",  __dir__)}" end

namespace :stimulus do
  desc "Install Stimulus into the app"
  task :install do
    if defined?(Webpacker::Engine)
      Rake::Task["stimulus:install:webpacker"].invoke
    else
      Rake::Task["stimulus:install:asset_pipeline"].invoke
    end
  end

  namespace :install do
    desc "Install Stimulus on the app with the asset pipeline"
    task :asset_pipeline do
      run_stimulus_install_template "stimulus_with_asset_pipeline"
    end

    desc "Install Stimulus on the app with webpacker"
    task :webpacker do
      run_stimulus_install_template "stimulus_with_webpacker"
    end
  end
end

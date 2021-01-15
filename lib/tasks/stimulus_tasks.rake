namespace :stimulus do
  desc "Install Stimulus into the app"
  task :install do
    if defined?(Webpacker::Engine)
      Rake::Task["webpacker:install:stimulus"].invoke
    else
      Rake::Task["stimulus:install:asset_pipeline"].invoke
    end
  end

  namespace :install do
    desc "Install Stimulus into the app with the asset pipeline"
    task :asset_pipeline do
      system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/stimulus_with_asset_pipeline.rb", __dir__)}"
    end
  end
end

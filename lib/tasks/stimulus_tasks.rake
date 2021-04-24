namespace :stimulus do
  desc "Install Stimulus into the app"
  task :install do
    Rails::Command.invoke :generate, ["stimulus:install"]
  end

  namespace :install do
    desc "Install Stimulus on the app with the asset pipeline"
    task :asset_pipeline do
      Rails::Command.invoke :generate, ["stimulus:install", "--no-webpacker"]
    end

    desc "Install Stimulus on the app with webpacker"
    task :webpacker do
      Rails::Command.invoke :generate, ["stimulus:install", "--webpacker"]
    end
  end
end

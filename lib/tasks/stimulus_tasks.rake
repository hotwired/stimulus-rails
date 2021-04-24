namespace :stimulus do
  desc "Install Stimulus"
  task :install do
    Rails::Command.invoke :generate, ["stimulus:install"]
  end

  namespace :install do
    desc "Install Stimulus with Sprockets"
    task :sprockets do
      Rails::Command.invoke :generate, ["stimulus:install", "--no-webpacker"]
    end

    desc "Install Stimulus with Webpacker"
    task :webpacker do
      Rails::Command.invoke :generate, ["stimulus:install", "--webpacker"]
    end
  end
end

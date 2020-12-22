# frozen_string_literal: true

namespace :stimulus do
  desc "Install Stimulus into the app"
  task :install do
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/stimulus.rb", __dir__)}"
  end
end

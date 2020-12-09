namespace :stimulus do
  desc "Explaining what the task does"
  task :install do
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{File.expand_path("../install/stimulus.rb", __dir__)}"
  end
end

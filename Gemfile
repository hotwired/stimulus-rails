source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in stimulus-rails.gemspec.
gemspec

rails_version = ENV["RAILS_VERSION"] || "6.1.0"
gem "rails", "~> #{rails_version}"

gem "sqlite3"
gem "turbo-rails", github: "hotwired/turbo-rails", branch: "main"

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "webdrivers"
end

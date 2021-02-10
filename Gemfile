source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in stimulus-rails.gemspec.
gemspec

gem "sqlite3"
gem "turbo-rails", github: "hotwired/turbo-rails", branch: "main"

group :test do
  gem "capybara"
  gem "capybara_accessible_selectors", github: "citizensadvice/capybara_accessible_selectors", branch: "main"
  gem "selenium-webdriver"
  gem "webdrivers"
end

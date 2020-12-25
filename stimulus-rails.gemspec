require_relative "lib/stimulus/version"

Gem::Specification.new do |spec|
  spec.name        = "stimulus-rails"
  spec.version     = Stimulus::VERSION
  spec.authors     = [ "Sam Stephenson", "Javan Mahkmali", "David Heinemeier Hansson" ]
  spec.email       = "david@loudthinking.com"
  spec.homepage    = "https://stimulus.hotwire.dev"
  spec.summary     = "A modest JavaScript framework for the HTML you already have."
  spec.license     = "MIT"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/hotwired/stimulus-rails"

  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", ">= 6.0.0"
  
  spec.add_development_dependency "sqlite3", "~> 1.4"
end

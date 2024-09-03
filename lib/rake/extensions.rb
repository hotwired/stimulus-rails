# Extend Rake to allow unscoping from within a scope/namespace.
# This allows engine tasks to unscope from :app and define top-level tasks.
module Rake

  module TaskManager
    def unscoped
      current_scope = @scope
      @scope = Scope.make
      ns = NameSpace.new(self, @scope)
      yield(ns)
      ns
    ensure
      @scope = current_scope
    end
  end

  module DSL
    def unscoped(&block)
      Rake.application.unscoped(&block)
    end
  end

end
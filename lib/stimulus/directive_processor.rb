module Stimulus
  class DirectiveProcessor < Sprockets::DirectiveProcessor
    def call(input)
      @input = input
      @environment = @input[:environment]
      @imports = {}
      @scopes = {}
      output = super(@input)
      process_input_importmap(output[:data])
      output.merge(data: output_importmap)
    end

    def process_map_directive(path)
      @imports.merge!(asset_map(path))
    end

    def process_map_directory_directive(path = ".", accept = nil)
      path = expand_relative_dirname(:map_directory, path)
      accept = expand_accept_shorthand(accept)
      resolve_paths(*@environment.stat_directory_with_dependencies(path), accept: accept) do |uri|
        @imports.merge!(asset_map(uri))
      end
    end

    def process_map_tree_directive(path = ".", accept = nil)
      path = expand_relative_dirname(:map_tree, path)
      accept = expand_accept_shorthand(accept)
      resolve_paths(*@environment.stat_sorted_tree_with_dependencies(path), accept: accept) do |uri|
        @imports.merge!(asset_map(uri))
      end
    end

    private

    def process_input_importmap(input)
      return unless input.present?
      json = ActiveSupport::JSON.decode(input)
      raise Sprockets::ContentTypeMismatch, "invalid importmap supplied" unless json.is_a? Hash
      @imports.merge!(json["imports"].to_h)
      @scopes.deep_merge!(json.except("imports").to_h)
    end

    def output_importmap
      ActiveSupport::JSON.encode({ "imports" => @imports }.merge(@scopes))
    end

    def asset_map(path)
      logical_path = @environment.find_asset!(resolve(path)).to_hash[:name]
      { logical_path => @environment.context_class.new(@input).asset_path(logical_path) }
    end

    def resolve(path, **kwargs)
      raise Sprockets::FileOutsidePaths, "can't require absolute file: #{path}" if @environment.absolute_path?(path)
      uri, deps = @environment.resolve!(path, **kwargs.merge(base_path: @dirname))
      @dependencies.merge(deps)
      uri
    end

    def resolve_paths(paths, deps, **kwargs)
      @dependencies.merge(deps)
      paths.each do |subpath, stat|
        next if subpath == @filename || stat.directory?
        uri, deps = @environment.resolve(subpath, **kwargs)
        @dependencies.merge(deps)
        yield uri if uri
      end
    end

    def expand_relative_dirname(directive, path)
      raise Sprockets::ArgumentError, "#{directive} argument must be a relative path" unless @environment.relative_path?(path)
      path = File.expand_path(path, @dirname)
      stat = @environment.stat(path)
      raise Sprockets::ArgumentError, "#{directive} argument must be a directory" unless stat.try(:directory?)
      path
    end

    def expand_accept_shorthand(accept)
      case accept
        when nil then nil
        when /\// then accept
        when /^\./ then @environment.mime_exts[accept]
        else @environment.mime_exts[".#{accept}"]
      end
    end
  end
end

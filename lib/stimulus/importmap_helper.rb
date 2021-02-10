module Stimulus::ImportmapHelper
  def importmap_list_with_stimulus_from(*paths)
    [
      %("stimulus": "#{asset_path("stimulus/libraries/stimulus")}"),
      importmap_list_from_standard_controllers,
      importmap_list_from(*paths)
    ].reject(&:blank?).join(",\n")
  end

  def importmap_list_from(*paths)
    Array(paths).flat_map do |path|
      if (absolute_path = absolute_root_of(path)).exist?
        find_javascript_files_in_tree(absolute_path).collect do |filename|
          module_filename = filename.relative_path_from(absolute_path)
          module_name     = importmap_module_name_from(module_filename)
          module_path     = asset_path(absolute_path.basename.join(module_filename))

          %("#{module_name}": "#{module_path}")
        end
      end
    end.compact.join(",\n")
  end

  def importmap_list_from_standard_controllers
    stimulus_root = Pathname(__dir__).join("../../app/assets/javascripts/stimulus/controllers")

    stimulus_root.glob("**/*.js").collect do |absolute_path|
      module_filename = absolute_path.relative_path_from(stimulus_root)
      module_name     = importmap_module_name_from(module_filename)
      module_path     = asset_path("stimulus/controllers/#{module_filename}")

      %("#{module_name}": "#{module_path}")
    end.compact.join(",\n")
  end

  private
    # Strip off the extension and any versioning data for an absolute module name.
    def importmap_module_name_from(filename)
      filename.to_s.remove(filename.extname).split("@").first
    end

    def find_javascript_files_in_tree(path)
      Dir[path.join("**/*.js{,m}")].collect { |file| Pathname.new(file) }.select(&:file?)
    end

    def absolute_root_of(path)
      (pathname = Pathname.new(path)).absolute? ? pathname : Rails.root.join(path)
    end
end

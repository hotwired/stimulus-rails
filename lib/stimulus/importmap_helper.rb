module Stimulus::ImportmapHelper
  def importmap_list_with_stimulus_from(*paths)
    [ %("stimulus": "#{asset_path("stimulus/libraries/stimulus")}"), importmap_list_from(*paths) ].join(",\n")
  end

  def importmap_list_from(*paths)
    Array(paths).flat_map do |path|
      if (absolute_path = Rails.root.join(path)).exist?
        absolute_path.children.collect do |module_filename|
          next unless module_filename.extname =~ /js(m)?$/
          
          module_name = importmap_module_name_from(module_filename)
          module_path = asset_path("#{absolute_path.basename.to_s}/#{module_filename.basename}")

          %("#{module_name}": "#{module_path}")
        end
      end
    end.compact.join(",\n")
  end

  private
    # Strip off the extension and any versioning data for an absolute module name.
    def importmap_module_name_from(filename)
      filename.basename.to_s.remove(filename.extname).split("@").first
    end
end

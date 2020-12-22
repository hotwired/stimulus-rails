# frozen_string_literal: true

module Stimulus::ImportmapHelper
  def importmap_list_with_stimulus_from(*paths)
    [ %("stimulus": "#{asset_path("stimulus/libraries/stimulus")}"), importmap_list_from(*paths) ].join(",\n")
  end

  def importmap_list_from(*paths)
    Array(paths).flat_map do |path|
      absolute_path = Rails.root.join(path)
      dirname       = absolute_path.basename.to_s

      absolute_path.children.collect do |module_filename|
        module_name = importmap_module_name_from(module_filename)
        %("#{module_name}": "#{asset_path("#{dirname}/#{module_filename.basename}")}")
      end
    end.join(",\n")
  end

  private
    # Strip off the extension and any versioning data for an absolute module name.
    def importmap_module_name_from(filename)
      filename.basename.to_s.remove(filename.extname).split("@").first
    end
end

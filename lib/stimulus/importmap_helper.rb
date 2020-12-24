require 'find'

module Stimulus::ImportmapHelper
  def importmap_list_with_stimulus_from(*paths)
    [ %("stimulus": "#{asset_path("stimulus/libraries/stimulus")}"), importmap_list_from(*paths) ].join(",\n")
  end

  def importmap_list_from(*paths)
    Array(paths).flat_map do |path|
      absolute_path = Rails.root.join(path)
      dirname       = absolute_path.basename.to_s

      Find.find(absolute_path).each_with_object([]) do |path, entries|
        next if FileTest.directory?(path)

        relative_pathname = Pathname.new(path).relative_path_from(absolute_path)
        module_name = importmap_module_name_from(relative_pathname)
        entries << %("#{module_name}": "#{asset_path("#{dirname}/#{relative_pathname}")}")
      end
    end.join(",\n")
  end

  private
    # Strip off the extension and any versioning data for an absolute module name.
    def importmap_module_name_from(relative_pathname)
      relative_pathname.to_s.remove(relative_pathname.extname).split("@").first
    end
end

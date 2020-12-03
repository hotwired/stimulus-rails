module Hotwire::ImportmapHelper
  def hotwire_importmap_controllers_list
    Rails.root.join("app/assets/javascripts/controllers").children.collect do |controller|
      %("controllers/#{controller.basename.to_s.remove(controller.extname)}": "#{asset_path("controllers/#{controller.basename}")}")
    end.join(",\n")
  end

  def hotwire_importmap_libraries_list
    Rails.root.join("app/assets/javascripts/libraries").children.collect do |lib|
      %("#{lib.basename.to_s.split("@").first}": "#{asset_path("libraries/#{lib.basename}")}")
    end.join(",\n")
  end

  def hotwire_import_hotwire_frameworks_list
    Hotwire::Engine.root.join("app/assets/javascripts/hotwire/frameworks").children.collect do |framework|
      %("#{framework.basename.to_s.split("@").first}": "#{asset_path("hotwire/frameworks/#{framework.basename}")}")
    end.join(",\n")
  end

  def hotwire_importmap_list
    [ hotwire_import_hotwire_frameworks_list, hotwire_importmap_libraries_list, hotwire_importmap_controllers_list ].join(",\n")
  end
end

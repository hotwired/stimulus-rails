Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get "/no_controllers/turbo" => "application#turbo", as: :turbo
  get "/no_controllers" => "application#no_controllers", as: :no_controllers

  root to: "application#index"
end

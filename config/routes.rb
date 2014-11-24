Rails.application.routes.draw do

  devise_for :users
  resources :users

  mount RailsAdmin::Engine  => '/admin', as: 'rails_admin'
  
  root 'home#index'

end

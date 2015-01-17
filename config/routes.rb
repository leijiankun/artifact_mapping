Rails.application.routes.draw do

  devise_for :users
  resources :users

  post '/parse_sql' => 'home#parse_sql', as: :parse_sql

  mount RailsAdmin::Engine  => '/admin', as: 'rails_admin'
  
  root 'home#index'


end

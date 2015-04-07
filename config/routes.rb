Rails.application.routes.draw do

  devise_for :users
  resources :users

  post '/parse_sql'          => 'home#parse_sql',             as: :parse_sql
  post '/parse_db_xml'       => 'home#parse_db_xml',          as: :parse_db_xml
  post '/get_sega_instance'  => 'home#get_sega_instance',     as: :get_sega_instance
  post '/get_sega_instance1' => 'home#get_sega_instance1',    as: :get_sega_instance1

  mount RailsAdmin::Engine  => '/admin', as: 'rails_admin'
  
  root 'home#index'


end

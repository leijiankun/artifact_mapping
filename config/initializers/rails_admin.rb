RailsAdmin.config do |config|

  ### Popular gems integration

  ## == Devise ==
  config.authenticate_with do
    warden.authenticate! scope: :staff
  end
  config.current_user_method(&:current_staff)

  config.main_app_name = ['笛威欧亚', '后台管理']
  config.default_items_per_page = 50
  config.total_columns_width = 960

  ## == Cancan ==
  # config.authorize_with :cancan

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  config.included_models = ["Staff", "Shop", "ShopStaff", "User","CarBrand", "CarModel", "CarModelItem", "Product", "ProductType", "Order", "Car", "WashCard"]

  config.model 'Staff' do 
    list do
      include_fields :id, :name, :email, :created_at
    end

    create do 
      include_fields :name, :email, :password, :password_confirmation
    end

    edit do 
      include_fields :name, :email, :password, :password_confirmation
    end
  
  end

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end
end

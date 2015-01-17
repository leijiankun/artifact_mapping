class HomeController < ApplicationController

  def index
    
  end

  def parse_sql
    render json: SqlParser.parse_sql_contents(File.read params[:sql_file].tempfile)
  end
  
end

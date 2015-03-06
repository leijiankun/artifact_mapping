class HomeController < ApplicationController

  def index
    
  end

  def parse_sql
    render json: SqlParser.parse_sql_contents(File.read params[:sql_file].tempfile)
  end

  def get_sega_instance
    tree = JSON.parse params[:artifact_tree]
    
    render json: tree.empty? ? {} : Artifact.get_all(tree.first)
  end
  
end

class HomeController < ApplicationController

  def index
    
  end

  def parse_db_xml
    doc = Nokogiri::XML(params[:xml_file])

    tables = []
    tables_map = {}
    types_map  = {
      "xs:integer" => "int",
      "xs:string"  => "varchar"
    }


    doc.xpath("/xs:schema/xs:element").each do |t|
      table = {
        table: t.attributes["name"].value,
        table_comment: t.attributes["type"].value,
        columns: []
      }

      tables_map[table] = table[:table_comment]

      column_tag = doc.xpath("/xs:schema/xs:complexType[@name='#{table[:table]}']").first

      if column_tag.present?
        column_tag.xpath(".//xs:sequence/xs:element").each do |column|
          attrs = column.attributes
          type = attrs["type"].value

          column = {
            name: attrs["name"].value,
            type: ( types_map.has_key?(type) ? types_map[type] : type )
          }

          table[:columns].push column
        end
      end

      tables.push table 
    end

    render json: tables 
  end

  def parse_sql
    render json: SqlParser.parse_sql_contents(File.read params[:sql_file].tempfile)
  end

  def get_sega_instance
    tree = JSON.parse params[:artifact_tree]

    render json: tree.empty? ? {} : Artifact.get_all(tree.first)
  end

  def get_sega_instance1
    tree = JSON.parse params[:artifact_tree]

    render json: tree.empty? ? {} : Artifact.get_all1(tree.first)
  end
  
end

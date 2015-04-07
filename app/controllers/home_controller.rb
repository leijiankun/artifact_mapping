class HomeController < ApplicationController

  def index
    
  end

  def parse_db_xml
    doc = Nokogiri::XML(params[:xml_file])

    entities = []
    entities_map = {}
    types_map  = {
      "xs:integer" => "int",
      "xs:string"  => "varchar"
    }

    doc.xpath("/xs:schema/xs:element").each do |t|
      entity = {
        name: t.attributes["name"].value,
        type: "artifact",
        children: []
      }

      entities_map[entity[:name]] = entity

      attribute_tag = doc.xpath("/xs:schema/xs:complexType[@name='#{entity[:name]}']").first

      if attribute_tag.present?
        attribute_tag.xpath(".//xs:sequence/xs:element").each do |attribute|
          attrs = attribute.attributes
          type = attrs["type"].value

          attribute = {
            name: attrs["name"].value,
            type: ( types_map.has_key?(type) ? types_map[type] : type )
          }
          attribute[:key] = true if attribute[:name] == 'ID'

          entity[:children].push attribute
        end
      end

      entities.push entity 
    end

    render json: entities 
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

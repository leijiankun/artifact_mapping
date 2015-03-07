class Artifact 

  def self.naive_get_all(artifact_tree)

    key_table = "tpg_gzfsqspb"

    sql = "SELECT #{key_table}.* from #{key_table} "
    instances = ActiveRecord::Base.connection.select_all(sql)

    results = []

    instances.each do |instance|
      result = {ID: instance["ID"], CODE: instance["CODE"], YWLD: instance["YWLD"]}
      result[:SQRID] = instance["SQRID"]
      result[:SQR] = {ID: instance["SQRID"]}
      sqr = self.get_artifact "tpg_ryxx", "ID", instance["SQRID"]
      result[:SQR][:XM] = sqr["XM"]
      result[:SQR][:CODE] = sqr["CODE"]

      results.push result
    end

    results
  end

  def self.get_rows(table_name)
    sql = "SELECT #{table_name}.* FROM #{table_name}"
    ActiveRecord::Base.connection.select_all(sql)
  end

  def self.get_row(table_name, key, key_value)
    sql = "SELECT #{table_name}.* FROM #{table_name} WHERE #{key} = '#{key_value}'"
    result = ActiveRecord::Base.connection.select_all(sql)
    result.empty? ? nil : result[0]
  end

  def self.get_key_node(artifact_tree)
    key_node = nil
    artifact_tree["children"].each do |node|
      if node["type"] == 'key' and node["mapped"]
        key_node = node
        break
      end
    end

    key_node
  end

  def self.get_all(artifact_tree)
    return [] unless artifact_tree["mapped"]
    artifact_table = artifact_tree["table"]

    # find primary key
    key_node = self.get_key_node artifact_tree

    return [] unless key_node.present?
    primary_key = key_node["mr"]["column"]
    artifact_table = key_node["mr"]["table"]

    results = []

    rows = self.get_rows artifact_table 
    rows.each do |row|
      results.push self.get_one artifact_tree, row[primary_key.upcase]
    end

    results
  end

  def self.get_one(artifact_tree, key)
    key_node = self.get_key_node artifact_tree
    return {} unless key_node.present?

    primary_key = key_node["mr"]["column"]
    artifact_table = key_node["mr"]["table"]

    row = self.get_row artifact_table, primary_key, key 
    return {} unless row.present?

    result = { }
    result["SQL"] = "SELECT #{artifact_table}.* FROM #{artifact_table} WHERE #{primary_key} = '#{key}'"

    result["attributes"] = []
    a = {primary_key => row[primary_key.upcase], "name" => key_node["name"]}
    result["attributes"].push a
    

    artifact_tree["children"].each do |attribute|
      # attribute
      if attribute["type"] == "other" and attribute["mapped"]
        # result[attribute["type"]] = row[attribute["type"].upcase]
        attr_name = attribute["mr"]["column"]["name"]
        # result[attribute["name"]] = row[attr_name.upcase]
        attr_value = { attr_name => row[attr_name.upcase], "name" => attribute["name"] }
        result["attributes"].push attr_value
      end

      # 1-1 mapping
      if attribute["type"] == "artifact" and attribute["mapped"]
        fk_table = attribute["mr"]["table"]
        fk_key = attribute["mr"]["fk"]["column"]["reference"].first["column"]
        reference_table = attribute["mr"]["fk"]["table"]
        reference_key = attribute["mr"]["fk"]["column"]["name"]

        reference_key_value = row[reference_key.upcase]

        # Recrusively get all artifact attributes
        a = { "name" => attribute["name"], reference_key => reference_key_value, fk_table => self.get_one(attribute, reference_key_value) }
        result["attributes"].push a
      end

    end

    result
  end

end

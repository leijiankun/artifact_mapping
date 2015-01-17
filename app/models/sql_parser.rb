class SqlParser

  def self.sql_data_types
    # MySQL data types
    # http://www.w3schools.com/sql/sql_datatypes.asp
    types = 'char varchar tinytext text blob mediumtext mediumblob longtext longblob tinyint smallint mediumint int bigint float double decimal date datetime timestemp time year'
    @types = types.split
  end

  def self.parse_attribute_type(s)
    self.sql_data_types.each do |type|
      if s.match '^'+type+'$' or s.match '^'+type+'\(' 
        attribute = { type: type }
        attribute[:size] = s[/\([\w]+\)/].gsub('(','').to_i if s.match '^'+type+'\(' 
        return attribute
      end
    end
    nil
  end

  def self.parse_create_table_sql(sql)
    # parse table name
    table_name = sql[/table\s[\w`]+/]
    return nil unless table_name
    table_name = table_name.split.last.gsub('`','')
    table = { table: table_name, table_comment: table_name }

    # parse attributes
    attributes = []
    columns = sql.split ','

    # parse table comment
    if columns.last.include? "comment="
      table[:table_comment] = columns.last[/comment=[\'\"][\W]+[\'\"]/].gsub("comment=",'').gsub("\'",'').gsub("\"", '')
    end

    columns.each do |column|
      arr = column.split
      count = 0
      arr.each do |e|
        attribute = parse_attribute_type e 
        if attribute 
          attribute[:name] = arr[count-1].gsub('`','')

          # parse column comment
          i = count 
          while i < arr.size - 1
            if arr[i] == 'comment'
              attribute[:comment] = arr[i+1].gsub("\'",'').gsub("\"",'')
              break
            end
            i = i + 1
          end

          attributes.push attribute
        end

        count = count + 1
      end
    end
    
    table[:columns] = attributes
    table
  end

  def self.parse_sql_contents(sql_contents)
    tables = []
    sqls = sql_contents.split ';'
    sqls.each do |sql|
      sql = sql.downcase
      if sql.include? 'create table'
        table = parse_create_table_sql sql
        tables.push table if table
      end
    end 
    tables 
  end


end

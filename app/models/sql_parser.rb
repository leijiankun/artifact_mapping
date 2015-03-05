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

  def self.parse_table_comments(sql)
    table_name = sql[/table\s[\w`]+/]
    return nil unless table_name
    table_name = table_name.split.last.gsub('`','')
    table = { table: table_name, table_comment: table_name }

    columns = sql.split ','

    # Parse table comment
    if columns.last.include? "comment="
      table[:table_comment] = columns.last[/comment=[\'\"][\W]+[\'\"]/].gsub("comment=",'').gsub("\'",'').gsub("\"", '')
    end

    table
  end

  def self.parse_create_table_sql(sql)
    # Parse table name
    table_name = sql[/table\s[\w`]+/]
    return nil unless table_name
    table_name = table_name.split.last.gsub('`','')
    table = @tables[table_name]

    # table = { table: table_name, table_comment: table_name }

    # @tables ||= {}
    # @tables[table_name] = table 


    # Scan all strings that match a pattern like '(`word`,`word`)'
    tmps = sql.scan(/\([\w`\s]+,[\w`\s]+\)/)
    sql = sql.gsub(/\([\w`\s]+,[\w`\s]+\)/, '_..._')

    # Parse attributes
    attributes = []
    columns = sql.split ','
    # columns = sql.split "\n"

    # Parse table comment
    # if columns.last.include? "comment="
    #   table[:table_comment] = columns.last[/comment=[\'\"][\W]+[\'\"]/].gsub("comment=",'').gsub("\'",'').gsub("\"", '')
    # end

    count_tmps = -1
    columns.each do |column|
      
      column = column.gsub('_..._'){ |t| t = tmps[count_tmps=count_tmps+1]}

      arr = column.split
      count = 0
      arr.each do |e|
        attribute = parse_attribute_type e 
        if attribute 
          attribute[:name] = arr[count-1].gsub('`','')

          # Parse column comment
          i = count 
          while i < arr.size - 1
            if arr[i] == 'comment'
              attribute[:comment] = arr[i+1].gsub("\'",'').gsub("\"",'')
              break
            end
            i = i + 1
          end

          attributes.push attribute
          break
        end

        count = count + 1
      end

      # Parse primary keys
      primary_key = column[/primary\skey\s[\(\w`\)]+/]
      if primary_key
        primary_key = primary_key[/\([\w`]+\)/].gsub('(','').gsub(')','').gsub('`','')
        attributes.each do |attribute| 
          if attribute[:name] == primary_key
            attribute[:primary_key] = true
            break
          end
        end
      end

      # Parse foreign keys
      # SQL example: CONSTRAINT `gsfsqspb_ibfk_2` FOREIGN KEY (`POID`) REFERENCES `ryxx` (`ID`)
      # SQL example2: CONSTRAINT `gsfsqspb_ibfk_2` FOREIGN KEY (`POID`,`TITLE`) REFERENCES `ryxx` (`ID`,`TITLE`)

      foreign_key = column[/foreign\skey\s\([\w`,\s]+\)/]
      if foreign_key

        foreign_key = foreign_key.gsub(/\s/, '')

        foreign_keys = foreign_key[/\([\w`\,]+\)/].gsub('(','').gsub(')','').gsub('`','')
        foreign_keys = foreign_keys.split(',')

        foreign_keys.each do |key|
          attributes.each do |attribute| 
            if attribute[:name] == key
              attribute[:foreign_key] = true
              attribute[:reference] ||= []

              reference = {}
              count = 0
              words = column.split
              words.each do |w|
                if w == 'references'
                  reference[:table] = words[count+1].gsub('`','')
                  reference[:fks] = foreign_keys
                  reference[:columns] = words[count+2].gsub('(','').gsub(')','').gsub('`','').split(',')
                  reference[:table_comment] = @tables[reference[:table]][:table_comment]
                end
                count = count + 1
              end

              attribute[:reference].push reference

              break
            end
          end

        end

        

      end

    end
    
    table[:columns] = attributes
    table
  end

  def self.parse_sql_contents(sql_contents)
    tables = []
    sqls = sql_contents.split ';'
    @tables = {}
    sqls.each do |sql|
      sql = sql.downcase 
      if sql.include? 'create table'
        table = parse_table_comments sql 
        @tables[table[:table]] = table 
      end
    end


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

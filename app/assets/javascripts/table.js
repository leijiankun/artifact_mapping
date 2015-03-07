var selected_columns = [];

var table_data = [];

function remove_selected_column(table,column){
    tr_class = table + column;
    $('#selected-columns tbody tr.'+tr_class).remove();
    for(var i=0;i<selected_columns.length;i++){
        if((selected_columns[i].table + selected_columns[i].column) == tr_class){
            selected_columns.splice(i,1);
            break;
        }
    }
}

function open_table(table){
    $('#table-model-list .panel .panel-body').hide();
    $('#table-model-list .panel[table_id='+table+'] .panel-body').show();
}

function init_tables(data){
    console.log(data);
    table_data = data;
    $('#table-model-list').empty();
    $('#selected-columns tbody tr').remove();
    // initialize tables from json
    for(var i=0;i<data.length;i++){
        $('#table-model-list').append(generate_table(data[i]));
    }

    $('.table-model-list .panel-heading>h3').bind('click',function(){
        $(this).parent().parent().find(".panel-body").slideToggle(400);
        mapping_rules_manager.clear();
    });

    $('#table-model-list .panel-body').hide();

    // click to select a table column 
    $('#table-model-list table tbody tr').click(function(){
        var table_id = $(this).attr("table_id");
        var column_index = $(this).attr("column_index");
        
        var lookUpColumn = function(tid, cid){
            for(var t=0;t<table_data.length;t++){
                if(table_data[t].table == tid){
                    var column_data = table_data[t].columns[column_index];
                    column_data.index = column_index;
                    return  {
                                table_comment: table_data[t].table_comment,
                                column_data: column_data
                            };
                }
            }
        }

        var r = lookUpColumn(table_id, column_index);

        var table_comment = r.table_comment;
        
        /*
        var html = '<tr class="'+table_name+column_name+'"><td>'+table_comment+'</td>'+$(this).html();
        html +='<td><a href="javascript:remove_selected_column(\''+table_name+'\',\''+column_name+'\')">X</a></td>';
        html +='</tr>';
        $('#selected-columns tbody').append(html);
        */
        selected_columns = [];
        selected_columns.push({
            table: table_id, 
            table_comment:table_comment, 
            column: r.column_data
        });

        //css 
        $('#table-model-list table tbody tr').removeClass("active");
        $(this).addClass("active");

        //notify mapping_panel
        if(mapping_panel)
            mapping_panel.updateDatabase(selected_columns);
    });

}


function generate_table(json){
  var html = '<div class="panel panel-default" table_id="'+json.table+'"><div class="panel-heading">';
  html += '<h3 class="panel-title">'+json.table_comment+'</h3></div>';
  html += '<div class="panel-body">';
  html += '<span style="display:none;" class="table_name">'+json.table+'</span>';
  html += '<table class="table table-hover table-bordered table-stripped">';
  html += '<thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>';
  html += '<tbody>'

  function getReferenceString(refs){
    var rs = "";
    for(var ref in refs){
        rs += "["+refs[ref].table_comment+" "+refs[ref].table + "]";
    }
    return rs;
  }

  for(var i=0;i<json.columns.length;i++){
    tr_class = json.columns[i].primary_key ? 'primary-key' : '';
    tr_class += json.columns[i].foreign_key ? 'foreign-key' : '';
    
    html += '<tr class="'+ tr_class +'" column_index='+ i +' table_id = "'+ json.table +'">';
    
    if(json.columns[i].foreign_key){
        html += '<td class="column-name"><span class="hint--left" data-hint="'+getReferenceString(json.columns[i].reference)+'">'+json.columns[i].name + '</span></td>';
    }else{
        html += '<td class="column-name">'+json.columns[i].name +'</td>';    
    }
    
    html += '<td class="column-type">'+json.columns[i].type +(json.columns[i].size != undefined ? ('('+json.columns[i].size+')') : '') +'</td>';
    html += '<td class="column-comment">'+(json.columns[i].comment !=undefined ? json.columns[i].comment : '')+'</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  html += '</div></div>';
  return html;
}

$(function(){

    init_tables(tables_json);

    // upload sql file
    $("#upload-sql-file").click(function(){
        $("#filechooser2").click();
      });

    $('#filechooser2').fileupload({
        url: '/parse_sql',
        dataType: 'json',
        start: function(){
          $('#upload-sql-file').addClass("disabled");
        },
        done: function (e, data) {
          init_tables(data.result);
        },
        error: function(){
          alert("导入模型失败");
        },
        complete: function(){
          $('#upload-sql-file').removeClass("disabled");
        }
    }); 

});

  

  


var tables_json = 
[{"table":"tpg_gzfsqspb","table_comment":"公租房申请审批表","columns":[{"type":"int","size":12,"name":"id","comment":"id","primary_key":true},{"type":"int","size":12,"name":"code","comment":"code"},{"type":"int","size":12,"name":"ywslid","comment":"业务实例id"},{"type":"varchar","size":20,"name":"ywlb","comment":"廉租房申请、变更、年审"},{"type":"varchar","size":10,"name":"spnd","comment":"审批年度"},{"type":"int","size":12,"name":"sqrid","comment":"申请人id","foreign_key":true,"reference":[{"table":"tpg_ryxx","fks":["sqrid"],"columns":["id"],"table_comment":"人员信息表"}]},{"type":"int","size":12,"name":"sqrcode","comment":"申请人code"},{"type":"varchar","size":100,"name":"sqrxm","comment":"申请人姓名"},{"type":"varchar","size":50,"name":"sqrsfzh","comment":"申请人身份证号"},{"type":"int","size":3,"name":"sqrnl","comment":"申请人年龄"},{"type":"varchar","size":50,"name":"sqrdwbh","comment":"申请人工作单位编号"},{"type":"varchar","size":100,"name":"sqrdwmc","comment":"申请人工作单位名称"},{"type":"int","size":12,"name":"poid","comment":"配偶id","foreign_key":true,"reference":[{"table":"tpg_ryxx","fks":["poid"],"columns":["id"],"table_comment":"人员信息表"}]},{"type":"int","size":12,"name":"pocode","comment":"配偶code"},{"type":"varchar","size":100,"name":"poxm","comment":"配偶姓名"},{"type":"varchar","size":50,"name":"posfzh","comment":"配偶身份证号"},{"type":"int","size":3,"name":"ponl","comment":"配偶年龄"},{"type":"varchar","size":50,"name":"podwbh","comment":"配偶工作单位编号"},{"type":"varchar","size":100,"name":"podwmc","comment":"配偶工作单位名称"},{"type":"int","size":12,"name":"jtid","comment":"家庭id","foreign_key":true,"reference":[{"table":"tpg_jtxx","fks":["jtid"],"columns":["id"],"table_comment":"家庭信息表"}]},{"type":"int","size":12,"name":"jtcode","comment":"家庭code"},{"type":"int","size":2,"name":"jtrs","comment":"家庭人数"},{"type":"int","size":9,"name":"jtnzsr","comment":"家庭年总收入"},{"type":"int","size":9,"name":"jtrjnsr","comment":"家庭人均年收入"},{"type":"int","size":3,"name":"hkrhns","comment":"户口入杭年数"},{"type":"int","size":12,"name":"jtzfqkid","comment":"家庭住房情况id"},{"type":"int","size":9,"name":"yyzfmj","comment":"已有住房面积"},{"type":"int","size":9,"name":"xsswffmj","comment":"享受实物分房面积"},{"type":"int","size":8,"name":"knzjlb","comment":"困难证件类别"},{"type":"varchar","size":50,"name":"knzjhm","comment":"困难证件号码"},{"type":"date","name":"knzjyxqq","comment":"困难证件有效期起"},{"type":"date","name":"knzjyxqz","comment":"困难证件有效期至"},{"type":"varchar","size":50,"name":"hsbh","comment":"杭社保号"},{"type":"int","size":8,"name":"yddxlb","comment":"普通、残疾、烈属"},{"type":"varchar","size":50,"name":"pzzgzh","comment":"配租资格证号"},{"type":"int","size":8,"name":"pzfs","comment":"配租方式"},{"type":"int","size":2,"name":"npzrs","comment":"拟配租人数"},{"type":"int","size":9,"name":"btmj","comment":"补贴面积"},{"type":"int","size":9,"name":"pzmjbz","comment":"配租面积标准"},{"type":"date","name":"yxqq","comment":"有效期起"},{"type":"date","name":"yxqz","comment":"有效期至"},{"type":"int","size":8,"name":"sjgszt","comment":"市局公示状态：0：默认值；1：待公示；2：公示中；3：完成公示"},{"type":"int","size":2,"name":"pzcs","comment":"配租次数"},{"type":"int","size":2,"name":"bjspzfacs","comment":"不接受配租方案次数"},{"type":"int","size":1,"name":"sffqzg","comment":"是否放弃资格"},{"type":"int","size":1,"name":"sfqxswpzzg","comment":"是否取消实物配租资格"},{"type":"int","size":1,"name":"sfgdq","comment":"是否过渡期"},{"type":"date","name":"gdqq","comment":"过渡期起"},{"type":"date","name":"gdqz","comment":"过渡期至"},{"type":"varchar","size":500,"name":"bz","comment":"备注"},{"type":"int","size":1,"name":"sfyx","comment":"是否有效"},{"type":"int","size":12,"name":"bgqspbid","comment":"变更前审批表id"},{"type":"varchar","size":50,"name":"bgqpzzgzh","comment":"变更前配租资格证号"},{"type":"int","size":8,"name":"bgqpzfs","comment":"变更前配租方式"},{"type":"varchar","size":500,"name":"bgyy","comment":"变更原因"},{"type":"int","size":1,"name":"sfcxdz","comment":"是否重新打证"},{"type":"int","size":2,"name":"bgcs","comment":"变更次数"},{"type":"varchar","size":500,"name":"nsyj","comment":"年审意见"},{"type":"int","size":1,"name":"nssftg","comment":"年审是否通过"},{"type":"int","size":8,"name":"lsbz","comment":"历史标志"},{"type":"date","name":"cjsj","comment":"创建时间"},{"type":"date","name":"zzsj","comment":"终止时间"},{"type":"int","size":8,"name":"szcq","comment":"所在城区"},{"type":"int","size":8,"name":"sssq","comment":"所属社区"},{"type":"int","size":8,"name":"szjd","comment":"所在街道"},{"type":"int","size":1,"name":"gsjg","comment":"公示结果"},{"type":"int","size":8,"name":"jxc","comment":"夹心层"},{"type":"int","size":8,"name":"sqqd","comment":"申请渠道"},{"type":"date","name":"slrq","comment":"受理时间"},{"type":"int","size":1,"name":"sfyyh","comment":"是否已摇号；0表示未摇号，1表示已摇号"},{"type":"date","name":"yhsj","comment":"摇号时间"},{"type":"int","size":8,"name":"qjgszt","comment":"区局公示状态：0：默认值；1：待公示；2：公示中；3：完成公示"},{"type":"date","name":"htqdsj","comment":"合同签订时间始"},{"type":"int","size":8,"name":"htqdns","comment":"合同签订年数"},{"type":"date","name":"ylbxjnns","comment":"养老保险交纳时间"},{"type":"int","size":8,"name":"jnns","comment":"养老保险交纳年数"},{"type":"date","name":"zfgjjjnsj","comment":"住房公积金交纳时间"},{"type":"int","size":8,"name":"zfgjjjnns","comment":"住房公积金交纳年数"},{"type":"date","name":"swwszmqx","comment":"税务完税证明期限"},{"type":"int","size":8,"name":"wsns","comment":"完税年数"},{"type":"varchar","size":50,"name":"yezz","comment":"营业执照"},{"type":"varchar","size":50,"name":"byxx","comment":"毕业学校"},{"type":"varchar","size":50,"name":"byzh","comment":"毕业证号"},{"type":"date","name":"bysj","comment":"毕业时间"},{"type":"int","size":8,"name":"xl","comment":"学历"},{"type":"int","size":8,"name":"zc","comment":"职称"},{"type":"int","size":8,"name":"zyzg","comment":"职业资格"},{"type":"varchar","size":100,"name":"slr","comment":"受理人"},{"type":"int","size":8,"name":"zjlb","comment":"证件类别"},{"type":"varchar","size":50,"name":"zzzh","comment":"临时赞助证号"},{"type":"int","size":8,"name":"zyzt","comment":"职业状态"},{"type":"int","size":8,"name":"hzlx","comment":"合租类型"},{"type":"varchar","size":50,"name":"slbh","comment":"受理编号"},{"type":"int","size":8,"name":"qs","comment":"摇号期数"},{"type":"varchar","size":20,"name":"yhnd","comment":"摇号年度"},{"type":"varchar","size":50,"name":"dabh","comment":"档案编号"},{"type":"date","name":"htqdsjz","comment":"合同签订时间止"},{"type":"int","size":8,"name":"sfypz","comment":"是否已配租"},{"type":"int","size":8,"name":"bjqsqlx","comment":"杭州高新区（滨江）创业人才公寓申请类型"},{"type":"int","size":8,"name":"hczt","comment":"(人工核查状态"},{"type":"int","size":1,"name":"stopflag","comment":"终止标示：0：正常；1：终止"},{"type":"int","size":1,"name":"sqbzlx","comment":"申请保障优先类型：1：优先保障；0：常规保障"},{"type":"int","size":1,"name":"yxbzlx","comment":"优先保障类型"},{"type":"int","size":12,"name":"hcbh","comment":"档案馆的核查编号，通过当前核查核可以调用到档案馆的核查结果"},{"type":"int","size":12,"name":"sxh","comment":"顺序号：调房申请顺序号"},{"type":"varchar","size":50,"name":"yezzh","comment":"营业执照号"},{"type":"varchar","size":50,"name":"zchm","comment":"职称/职业资格证书号"},{"type":"varchar","size":20,"name":"jpzzgzh","comment":"旧保障资格证号"},{"type":"varchar","size":2000,"name":"zxyy","comment":"注销原因"},{"type":"date","name":"zxsj","comment":"注销时间"},{"type":"int","size":8,"name":"pzlx","comment":"配租类型"},{"type":"int","size":9,"name":"hbbtbz","comment":"货币补贴标准"},{"type":"int","size":9,"name":"hbbtxs","comment":"货币补贴系数"},{"type":"int","size":9,"name":"yhbbtje","comment":"月货币补贴金额"}]},{"table":"tpg_jtxx","table_comment":"家庭信息表","columns":[{"type":"int","size":12,"name":"id","comment":"id","primary_key":true},{"type":"int","size":12,"name":"code","comment":"code"},{"type":"int","size":12,"name":"cjrcode","comment":"家庭创建人code"},{"type":"int","size":2,"name":"jtrs","comment":"家庭人数"},{"type":"int","size":8,"name":"knzjlb","comment":"困难证件类别"},{"type":"varchar","size":50,"name":"knzjhm","comment":"困难证件号码"},{"type":"date","name":"knzjyxqq","comment":"困难证件有效期起"},{"type":"date","name":"knzjyxqz","comment":"困难证件有效期至"},{"type":"int","size":8,"name":"lsbz","comment":"历史标志"},{"type":"date","name":"cjsj","comment":"创建时间"},{"type":"int","size":1,"name":"sfyx","comment":"是否有效"},{"type":"varchar","size":32,"name":"bbbs","comment":"版本标识"},{"type":"int","size":8,"name":"knzjmc","comment":"困难证件名称（是困难证件的子类别）"}]},{"table":"tpg_rygx","table_comment":"人员关系表","columns":[{"type":"int","size":12,"name":"id","comment":"id","primary_key":true},{"type":"int","size":12,"name":"cjrid","comment":"创建人id","foreign_key":true,"reference":[{"table":"tpg_ryxx","fks":["cjrid"],"columns":["id"],"table_comment":"人员信息表"}]},{"type":"int","size":12,"name":"cjrcode","comment":"创建人code"},{"type":"varchar","size":100,"name":"cjrxm","comment":"创建人姓名"},{"type":"int","size":8,"name":"gx","comment":"创建人、妻子、丈夫、儿子等单向关系"},{"type":"int","size":12,"name":"gxrid","comment":"关系人id","foreign_key":true,"reference":[{"table":"tpg_ryxx","fks":["gxrid"],"columns":["id"],"table_comment":"人员信息表"}]},{"type":"int","size":12,"name":"gxrcode","comment":"关系人code"},{"type":"varchar","size":100,"name":"gxrxm","comment":"关系人姓名"},{"type":"int","size":12,"name":"jtid","comment":"家庭id","foreign_key":true,"reference":[{"table":"tpg_jtxx","fks":["jtid"],"columns":["id"],"table_comment":"家庭信息表"}]},{"type":"int","size":12,"name":"jtcode","comment":"家庭code"},{"type":"int","size":1,"name":"sfyx","comment":"是否有效"},{"type":"int","size":8,"name":"lsbz","comment":"历史标志"},{"type":"date","name":"cjsj","comment":"创建时间"}]},{"table":"tpg_ryxx","table_comment":"人员信息表","columns":[{"type":"int","size":12,"name":"id","comment":"id","primary_key":true},{"type":"int","size":12,"name":"code","comment":"code"},{"type":"int","size":12,"name":"bzcode","comment":"标准code"},{"type":"varchar","size":100,"name":"xm","comment":"姓名"},{"type":"int","size":8,"name":"xb","comment":"性别"},{"type":"char","size":10,"name":"zjlb","comment":"证件类别"},{"type":"varchar","size":50,"name":"sfzh","comment":"身份证号"},{"type":"date","name":"csrq","comment":"出生日期"},{"type":"int","size":1,"name":"sfycn","comment":"是否已成年"},{"type":"int","size":8,"name":"hyzk","comment":"婚姻状况"},{"type":"int","size":8,"name":"xl","comment":"学历"},{"type":"int","size":8,"name":"hjlx","comment":"本地居民、本地农业、外地居民、外地农业、外籍"},{"type":"varchar","size":50,"name":"hjhm","comment":"户籍号码"},{"type":"varchar","size":100,"name":"hkszd","comment":"户口所在地"},{"type":"date","name":"hkscrhsj","comment":"户口首次入杭时间"},{"type":"int","size":8,"name":"szcq","comment":"所在城区"},{"type":"varchar","size":100,"name":"szcqmc","comment":"所在城区名称"},{"type":"int","size":8,"name":"szjd","comment":"所在街道"},{"type":"varchar","size":100,"name":"szjdmc","comment":"所在街道名称"},{"type":"int","size":8,"name":"sssq","comment":"所属社区"},{"type":"varchar","size":100,"name":"sssqmc","comment":"所属社区名称"},{"type":"varchar","size":100,"name":"zz","comment":"住址"},{"type":"int","size":12,"name":"dwid","comment":"工作单位id"},{"type":"varchar","size":50,"name":"dwbh","comment":"工作单位编号"},{"type":"varchar","size":100,"name":"dwmc","comment":"工作单位名称"},{"type":"int","size":8,"name":"dwsshy","comment":"单位所属行业"},{"type":"int","size":8,"name":"zzqk","comment":"在职情况"},{"type":"int","size":8,"name":"zyzt","comment":"职业状态"},{"type":"int","size":8,"name":"zwzc","comment":"职务职称"},{"type":"date","name":"cjgzsj","comment":"参加工作时间"},{"type":"date","name":"gzsj","comment":"供职时间"},{"type":"int","size":4,"name":"fggl","comment":"房改工龄"},{"type":"int","size":4,"name":"fgjl","comment":"房改教龄"},{"type":"int","size":9,"name":"sndzsr","comment":"上年度总收入"},{"type":"varchar","size":50,"name":"gjjzh","comment":"公积金账号"},{"type":"varchar","size":50,"name":"cjzh","comment":"残疾证号"},{"type":"int","size":8,"name":"cjdj","comment":"残疾等级"},{"type":"int","size":8,"name":"cjlx","comment":"低视力/盲人/上肢/下肢/智力/精神/听力/言语"},{"type":"int","size":1,"name":"sfjls","comment":"是否军烈属"},{"type":"varchar","size":100,"name":"yddh","comment":"移动电话"},{"type":"varchar","size":50,"name":"lxdh","comment":"联系电话"},{"type":"varchar","size":200,"name":"lxdz","comment":"联系地址"},{"type":"int","size":6,"name":"yzbm","comment":"邮政编码"},{"type":"varchar","size":100,"name":"dzyj","comment":"email"},{"type":"varchar","size":500,"name":"bz","comment":"备注"},{"type":"int","size":1,"name":"sfgfr","comment":"是否购房人"},{"type":"int","size":8,"name":"lsbz","comment":"历史标志"},{"type":"date","name":"cjsj","comment":"创建时间"},{"type":"date","name":"zzsj","comment":"终止时间"},{"type":"int","size":1,"name":"sfyx","comment":"是否有效"},{"type":"date","name":"htqdsj","comment":"合同签订时间始"},{"type":"int","size":8,"name":"htqdns","comment":"合同签订年数"},{"type":"date","name":"ylbxjnns","comment":"养老保险交纳时间"},{"type":"int","size":8,"name":"jnns","comment":"养老保险交纳年数"},{"type":"date","name":"zfgjjjnsj","comment":"住房公积金交纳时间"},{"type":"int","size":8,"name":"zfgjjjnns","comment":"住房公积金交纳年数"},{"type":"date","name":"swwszmqx","comment":"税务完税证明期限"},{"type":"int","size":8,"name":"wsns","comment":"完税年数"},{"type":"varchar","size":50,"name":"zzzh","comment":"临时暂住证"},{"type":"int","size":8,"name":"zyzg","comment":"职业资格"},{"type":"int","size":8,"name":"zc","comment":"职称"},{"type":"date","name":"bysj","comment":"毕业时间"},{"type":"date","name":"htqdsjz","comment":"合同签订时间止"},{"type":"int","size":1,"name":"lrhcfw","comment":"列入核查范围（廉租房）"},{"type":"int","size":1,"name":"sfxz","comment":"是否限制购房"}]}];
    
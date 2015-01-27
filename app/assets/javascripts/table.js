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

function init_tables(data){
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
  var html = '<div class="panel panel-default"><div class="panel-heading">';
  html += '<h3 class="panel-title">'+json.table_comment+'</h3></div>';
  html += '<div class="panel-body">';
  html += '<span style="display:none;" class="table_name">'+json.table+'</span>';
  html += '<table class="table table-hover table-bordered table-stripped">';
  html += '<thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>';
  html += '<tbody>'
  for(var i=0;i<json.columns.length;i++){
    tr_class = json.columns[i].primary_key ? 'primary-key' : '';
    tr_class += json.columns[i].foreign_key ? 'foreign-key' : '';
    html += '<tr class="'+ tr_class +'" column_index='+ i +' table_id = "'+ json.table +'">';
    html += '<td class="column-name">'+json.columns[i].name +'</td>';
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

  

  


var tables_json = [
    {
        "table": "tb1", 
        "table_comment": "公租房申请审批表",
        "columns": [
            {
                "name": "ID", 
                "type": "NUMBER(12)", 
                "comment": "ID",
                "primary_key": true
            }, 
            {
                "name": "CODE", 
                "type": "NUMBER(12)", 
                "comment": "CODE"
            }, 
            {
                "name": "YWSLID", 
                "type": "NUMBER(12)", 
                "comment": "业务实例ID"
            }, 
            {
                "name": "YWLB", 
                "type": "VARCHAR2(20)", 
                "comment": "廉租房申请、变更、年审"
            }, 
            {
                "name": "SPND", 
                "type": "VARCHAR2(10)", 
                "comment": "审批年度"
            }, 
            {
                "name": "SQRID", 
                "type": "NUMBER(12)", 
                "comment": "申请人ID",
                "foreign_key": true
            }, 
            {
                "name": "SQRCODE", 
                "type": "NUMBER(12)", 
                "comment": "申请人CODE"
            }, 
            {
                "name": "SQRXM", 
                "type": "VARCHAR2(100)", 
                "comment": "申请人姓名"
            }, 
            {
                "name": "SQRSFZH", 
                "type": "VARCHAR2(50)", 
                "comment": "申请人身份证号"
            }, 
            {
                "name": "SQRNL", 
                "type": "NUMBER(3)", 
                "comment": "申请人年龄"
            }, 
            {
                "name": "SQRDWBH", 
                "type": "VARCHAR2(50)", 
                "comment": "申请人工作单位编号"
            }, 
            {
                "name": "SQRDWMC", 
                "type": "VARCHAR2(100)", 
                "comment": "申请人工作单位名称"
            }, 
            {
                "name": "POID", 
                "type": "NUMBER(12)", 
                "comment": "配偶ID"
            }, 
            {
                "name": "POCODE", 
                "type": "NUMBER(12)", 
                "comment": "配偶CODE"
            }, 
            {
                "name": "POXM", 
                "type": "VARCHAR2(100)", 
                "comment": "配偶姓名"
            }, 
            {
                "name": "POSFZH", 
                "type": "VARCHAR2(50)", 
                "comment": "配偶身份证号"
            }, 
            {
                "name": "PONL", 
                "type": "NUMBER(3)", 
                "comment": "配偶年龄"
            }, 
            {
                "name": "PODWBH", 
                "type": "VARCHAR2(50)", 
                "comment": "配偶工作单位编号"
            }, 
            {
                "name": "PODWMC", 
                "type": "VARCHAR2(100)", 
                "comment": "配偶工作单位名称"
            }, 
            {
                "name": "JTID", 
                "type": "NUMBER(12)", 
                "comment": "家庭ID"
            }, 
            {
                "name": "JTCODE", 
                "type": "NUMBER(12)", 
                "comment": "家庭CODE"
            }, 
            {
                "name": "JTRS", 
                "type": "NUMBER(2)", 
                "comment": "家庭人数"
            }, 
            {
                "name": "JTNZSR", 
                "type": "NUMBER(9,2)", 
                "comment": "家庭年总收入"
            }, 
            {
                "name": "JTRJNSR", 
                "type": "NUMBER(9,2)", 
                "comment": "家庭人均年收入"
            }, 
            {
                "name": "HKRHNS", 
                "type": "NUMBER(3)", 
                "comment": "户口入杭年数"
            }, 
            {
                "name": "JTZFQKID", 
                "type": "NUMBER(12)", 
                "comment": "家庭住房情况ID"
            }, 
            {
                "name": "YYZFMJ", 
                "type": "NUMBER(9,2)", 
                "comment": "已有住房面积"
            }, 
            {
                "name": "XSSWFFMJ", 
                "type": "NUMBER(9,2)", 
                "comment": "享受实物分房面积"
            }, 
            {
                "name": "KNZJLB", 
                "type": "NUMBER(8)", 
                "comment": "困难证件类别"
            }, 
            {
                "name": "KNZJHM", 
                "type": "VARCHAR2(50)", 
                "comment": "困难证件号码"
            }, 
            {
                "name": "KNZJYXQQ", 
                "type": "DATE", 
                "comment": "困难证件有效期起"
            }, 
            {
                "name": "KNZJYXQZ", 
                "type": "DATE", 
                "comment": "困难证件有效期至"
            }, 
            {
                "name": "HSBH", 
                "type": "VARCHAR2(50)", 
                "comment": "杭社保号"
            }, 
            {
                "name": "YDDXLB", 
                "type": "NUMBER(8)", 
                "comment": "普通、残疾、烈属"
            }, 
            {
                "name": "PZZGZH", 
                "type": "VARCHAR2(50)", 
                "comment": "配租资格证号"
            }, 
            {
                "name": "PZFS", 
                "type": "NUMBER(8)", 
                "comment": "配租方式"
            }, 
            {
                "name": "NPZRS", 
                "type": "NUMBER(2)", 
                "comment": "拟配租人数"
            }, 
            {
                "name": "BTMJ", 
                "type": "NUMBER(9,2)", 
                "comment": "补贴面积"
            }, 
            {
                "name": "PZMJBZ", 
                "type": "NUMBER(9,2)", 
                "comment": "配租面积标准"
            }, 
            {
                "name": "YXQQ", 
                "type": "DATE", 
                "comment": "有效期起"
            }, 
            {
                "name": "YXQZ", 
                "type": "DATE", 
                "comment": "有效期至"
            }, 
            {
                "name": "SJGSZT", 
                "type": "NUMBER(8)", 
                "comment": "市局公示状态：0：默认值；1：待公示；2：公示中；3：完成公示"
            }, 
            {
                "name": "PZCS", 
                "type": "NUMBER(2)", 
                "comment": "配租次数"
            }, 
            {
                "name": "BJSPZFACS", 
                "type": "NUMBER(2)", 
                "comment": "不接受配租方案次数"
            }, 
            {
                "name": "SFFQZG", 
                "type": "NUMBER(1)", 
                "comment": "是否放弃资格"
            }, 
            {
                "name": "SFQXSWPZZG", 
                "type": "NUMBER(1)", 
                "comment": "是否取消实物配租资格"
            }, 
            {
                "name": "SFGDQ", 
                "type": "NUMBER(1)", 
                "comment": "是否过渡期"
            }, 
            {
                "name": "GDQQ", 
                "type": "DATE", 
                "comment": "过渡期起"
            }, 
            {
                "name": "GDQZ", 
                "type": "DATE", 
                "comment": "过渡期至"
            }, 
            {
                "name": "BZ", 
                "type": "VARCHAR2(500)", 
                "comment": "备注"
            }, 
            {
                "name": "SFYX", 
                "type": "NUMBER(1)", 
                "comment": "是否有效"
            }, 
            {
                "name": "BGQSPBID", 
                "type": "NUMBER(12)", 
                "comment": "变更前审批表ID"
            }, 
            {
                "name": "BGQPZZGZH", 
                "type": "VARCHAR2(50)", 
                "comment": "变更前配租资格证号"
            }, 
            {
                "name": "BGQPZFS", 
                "type": "NUMBER(8)", 
                "comment": "变更前配租方式"
            }, 
            {
                "name": "BGYY", 
                "type": "VARCHAR2(500)", 
                "comment": "变更原因"
            }, 
            {
                "name": "SFCXDZ", 
                "type": "NUMBER(1)", 
                "comment": "是否重新打证"
            }, 
            {
                "name": "BGCS", 
                "type": "NUMBER(2)", 
                "comment": "变更次数"
            }, 
            {
                "name": "NSYJ", 
                "type": "VARCHAR2(500)", 
                "comment": "年审意见"
            }, 
            {
                "name": "NSSFTG", 
                "type": "NUMBER(1)", 
                "comment": "年审是否通过"
            }, 
            {
                "name": "LSBZ", 
                "type": "NUMBER(8)", 
                "comment": "历史标志"
            }, 
            {
                "name": "CJSJ", 
                "type": "DATE", 
                "comment": "创建时间"
            }, 
            {
                "name": "ZZSJ", 
                "type": "DATE", 
                "comment": "终止时间"
            }, 
            {
                "name": "SZCQ", 
                "type": "NUMBER(8)", 
                "comment": "所在城区"
            }, 
            {
                "name": "SSSQ", 
                "type": "NUMBER(8)", 
                "comment": "所属社区"
            }, 
            {
                "name": "SZJD", 
                "type": "NUMBER(8)", 
                "comment": "所在街道"
            }, 
            {
                "name": "GSJG", 
                "type": "NUMBER(1)", 
                "comment": "公示结果"
            }, 
            {
                "name": "JXC", 
                "type": "NUMBER(8)", 
                "comment": "夹心层"
            }, 
            {
                "name": "SQQD", 
                "type": "NUMBER(8)", 
                "comment": "申请渠道"
            }, 
            {
                "name": "SLRQ", 
                "type": "DATE", 
                "comment": "受理时间"
            }, 
            {
                "name": "SFYYH", 
                "type": "NUMBER(1)", 
                "comment": "是否已摇号；0表示未摇号，1表示已摇号"
            }, 
            {
                "name": "YHSJ", 
                "type": "DATE", 
                "comment": "摇号时间"
            }, 
            {
                "name": "QJGSZT", 
                "type": "NUMBER(8)", 
                "comment": "区局公示状态：0：默认值；1：待公示；2：公示中；3：完成公示"
            }, 
            {
                "name": "HTQDSJ", 
                "type": "DATE", 
                "comment": "合同签订时间始"
            }, 
            {
                "name": "HTQDNS", 
                "type": "NUMBER(8)", 
                "comment": "合同签订年数"
            }, 
            {
                "name": "YLBXJNNS", 
                "type": "DATE", 
                "comment": "养老保险交纳时间"
            }, 
            {
                "name": "JNNS", 
                "type": "NUMBER(8)", 
                "comment": "养老保险交纳年数"
            }, 
            {
                "name": "ZFGJJJNSJ", 
                "type": "DATE", 
                "comment": "住房公积金交纳时间"
            }, 
            {
                "name": "ZFGJJJNNS", 
                "type": "NUMBER(8)", 
                "comment": "住房公积金交纳年数"
            }, 
            {
                "name": "SWWSZMQX", 
                "type": "DATE", 
                "comment": "税务完税证明期限"
            }, 
            {
                "name": "WSNS", 
                "type": "NUMBER(8)", 
                "comment": "完税年数"
            }, 
            {
                "name": "YEZZ", 
                "type": "VARCHAR2(50)", 
                "comment": "营业执照"
            }, 
            {
                "name": "BYXX", 
                "type": "VARCHAR2(50)", 
                "comment": "毕业学校"
            }, 
            {
                "name": "BYZH", 
                "type": "VARCHAR2(50)", 
                "comment": "毕业证号"
            }, 
            {
                "name": "BYSJ", 
                "type": "DATE", 
                "comment": "毕业时间"
            }, 
            {
                "name": "XL", 
                "type": "NUMBER(8)", 
                "comment": "学历"
            }, 
            {
                "name": "ZC", 
                "type": "NUMBER(8)", 
                "comment": "职称"
            }, 
            {
                "name": "ZYZG", 
                "type": "NUMBER(8)", 
                "comment": "职业资格"
            }, 
            {
                "name": "SLR", 
                "type": "VARCHAR2(100)", 
                "comment": "受理人"
            }, 
            {
                "name": "ZJLB", 
                "type": "NUMBER(8)", 
                "comment": "证件类别"
            }, 
            {
                "name": "ZZZH", 
                "type": "VARCHAR2(50)", 
                "comment": "临时赞助证号"
            }, 
            {
                "name": "ZYZT", 
                "type": "NUMBER(8)", 
                "comment": "职业状态"
            }, 
            {
                "name": "HZLX", 
                "type": "NUMBER(8)", 
                "comment": "合租类型"
            }, 
            {
                "name": "SLBH", 
                "type": "VARCHAR2(50)", 
                "comment": "受理编号"
            }, 
            {
                "name": "QS", 
                "type": "NUMBER(8)", 
                "comment": "摇号期数"
            }, 
            {
                "name": "YHND", 
                "type": "VARCHAR2(20)", 
                "comment": "摇号年度"
            }, 
            {
                "name": "DABH", 
                "type": "VARCHAR2(50)", 
                "comment": "档案编号"
            }, 
            {
                "name": "HTQDSJZ", 
                "type": "DATE", 
                "comment": "合同签订时间止"
            }, 
            {
                "name": "SFYPZ", 
                "type": "NUMBER(8)", 
                "comment": "是否已配租"
            }, 
            {
                "name": "BJQSQLX", 
                "type": "NUMBER(8)", 
                "comment": "杭州高新区（滨江）创业人才公寓申请类型"
            }, 
            {
                "name": "HCZT", 
                "type": "NUMBER(8)", 
                "comment": "(人工核查状态"
            }, 
            {
                "name": "STOPFLAG", 
                "type": "NUMBER(1)", 
                "comment": "终止标示：0：正常；1：终止"
            }, 
            {
                "name": "SQBZLX", 
                "type": "NUMBER(1)", 
                "comment": "申请保障优先类型：1：优先保障；0：常规保障"
            }, 
            {
                "name": "YXBZLX", 
                "type": "NUMBER(1)", 
                "comment": "优先保障类型"
            }, 
            {
                "name": "HCBH", 
                "type": "NUMBER(12)", 
                "comment": "档案馆的核查编号，通过当前核查核可以调用到档案馆的核查结果"
            }, 
            {
                "name": "SXH", 
                "type": "NUMBER(12)", 
                "comment": "顺序号：调房申请顺序号"
            }, 
            {
                "name": "YEZZH", 
                "type": "VARCHAR2(50)", 
                "comment": "营业执照号"
            }, 
            {
                "name": "ZCHM", 
                "type": "VARCHAR2(50)", 
                "comment": "职称/职业资格证书号"
            }, 
            {
                "name": "JPZZGZH", 
                "type": "VARCHAR2(20)", 
                "comment": "旧保障资格证号"
            }, 
            {
                "name": "ZXYY", 
                "type": "VARCHAR2(2000)", 
                "comment": "注销原因"
            }, 
            {
                "name": "ZXSJ", 
                "type": "DATE", 
                "comment": "注销时间"
            }, 
            {
                "name": "PZLX", 
                "type": "NUMBER(8)", 
                "comment": "配租类型"
            }, 
            {
                "name": "HBBTBZ", 
                "type": "NUMBER(9,2)", 
                "comment": "货币补贴标准"
            }, 
            {
                "name": "HBBTXS", 
                "type": "NUMBER(9,2)", 
                "comment": "货币补贴系数"
            }, 
            {
                "name": "YHBBTJE", 
                "type": "NUMBER(9,2)", 
                "comment": "月货币补贴金额"
            }
        ]
    },
    {
        "table": "tb2", 
        "table_comment": "家庭信息表",
        "columns": [
            {
                "name": "ID", 
                "type": "NUMBER(12)", 
                "comment": "ID",
                "primary_key": true
            }, 
            {
                "name": "CODE", 
                "type": "NUMBER(12)", 
                "comment": "CODE"
            }, 
            {
                "name": "CJRCODE", 
                "type": "NUMBER(12)", 
                "comment": "家庭创建人CODE"
            }, 
            {
                "name": "JTRS", 
                "type": "NUMBER(2)", 
                "comment": "家庭人数"
            }, 
            {
                "name": "KNZJLB", 
                "type": "NUMBER(8)", 
                "comment": "困难证件类别"
            }, 
            {
                "name": "KNZJHM", 
                "type": "VARCHAR2(50)", 
                "comment": "困难证件号码"
            }, 
            {
                "name": "KNZJYXQQ", 
                "type": "DATE", 
                "comment": "困难证件有效期起"
            }, 
            {
                "name": "KNZJYXQZ", 
                "type": "DATE", 
                "comment": "困难证件有效期至"
            }, 
            {
                "name": "LSBZ", 
                "type": "NUMBER(8)", 
                "comment": "历史标志"
            }, 
            {
                "name": "CJSJ", 
                "type": "DATE", 
                "comment": "创建时间"
            }, 
            {
                "name": "SFYX", 
                "type": "NUMBER(1)", 
                "comment": "是否有效"
            }, 
            {
                "name": "BBBS", 
                "type": "VARCHAR2(32)", 
                "comment": "版本标识"
            }, 
            {
                "name": "KNZJMC", 
                "type": "NUMBER(8)", 
                "comment": "困难证件名称（是困难证件的子类别）"
            }
        ]
    },
    {
        "table": "tb3", 
        "table_comment": "人员关系表",
        "columns": [
            {
                "name": "ID", 
                "type": "NUMBER(12)", 
                "comment": "ID",
                "primary_key": true
            }, 
            {
                "name": "CJRID", 
                "type": "NUMBER(12)", 
                "comment": "创建人ID"
            }, 
            {
                "name": "CJRCODE", 
                "type": "NUMBER(12)", 
                "comment": "创建人CODE"
            }, 
            {
                "name": "CJRXM", 
                "type": "VARCHAR2(100)", 
                "comment": "创建人姓名"
            }, 
            {
                "name": "GX", 
                "type": "NUMBER(8)", 
                "comment": "创建人、妻子、丈夫、儿子等单向关系"
            }, 
            {
                "name": "GXRID", 
                "type": "NUMBER(12)", 
                "comment": "关系人ID"
            }, 
            {
                "name": "GXRCODE", 
                "type": "NUMBER(12)", 
                "comment": "关系人CODE"
            }, 
            {
                "name": "GXRXM", 
                "type": "VARCHAR2(100)", 
                "comment": "关系人姓名"
            }, 
            {
                "name": "JTID", 
                "type": "NUMBER(12)", 
                "comment": "家庭ID"
            }, 
            {
                "name": "JTCODE", 
                "type": "NUMBER(12)", 
                "comment": "家庭CODE"
            }, 
            {
                "name": "SFYX", 
                "type": "NUMBER(1)", 
                "comment": "是否有效"
            }, 
            {
                "name": "LSBZ", 
                "type": "NUMBER(8)", 
                "comment": "历史标志"
            }, 
            {
                "name": "CJSJ", 
                "type": "DATE", 
                "comment": "创建时间"
            }
        ]
    },
    {
        "table": "tb4", 
        "table_comment": "人员信息表",
        "columns": [
            {
                "name": "ID", 
                "type": "NUMBER(12)", 
                "comment": "ID",
                "primary_key": true
            }, 
            {
                "name": "CODE", 
                "type": "NUMBER(12)", 
                "comment": "CODE"
            }, 
            {
                "name": "BZCODE", 
                "type": "NUMBER(12)", 
                "comment": "标准CODE"
            }, 
            {
                "name": "XM", 
                "type": "VARCHAR2(100)", 
                "comment": "姓名"
            }, 
            {
                "name": "XB", 
                "type": "NUMBER(8)", 
                "comment": "性别"
            }, 
            {
                "name": "ZJLB", 
                "type": "CHAR(10)", 
                "comment": "证件类别"
            }, 
            {
                "name": "SFZH", 
                "type": "VARCHAR2(50)", 
                "comment": "身份证号"
            }, 
            {
                "name": "CSRQ", 
                "type": "DATE", 
                "comment": "出生日期"
            }, 
            {
                "name": "SFYCN", 
                "type": "NUMBER(1)", 
                "comment": "是否已成年"
            }, 
            {
                "name": "HYZK", 
                "type": "NUMBER(8)", 
                "comment": "婚姻状况"
            }, 
            {
                "name": "XL", 
                "type": "NUMBER(8)", 
                "comment": "学历"
            }, 
            {
                "name": "HJLX", 
                "type": "NUMBER(8)", 
                "comment": "本地居民、本地农业、外地居民、外地农业、外籍"
            }, 
            {
                "name": "HJHM", 
                "type": "VARCHAR2(50)", 
                "comment": "户籍号码"
            }, 
            {
                "name": "HKSZD", 
                "type": "VARCHAR2(100)", 
                "comment": "户口所在地"
            }, 
            {
                "name": "HKSCRHSJ", 
                "type": "DATE", 
                "comment": "户口首次入杭时间"
            }, 
            {
                "name": "SZCQ", 
                "type": "NUMBER(8)", 
                "comment": "所在城区"
            }, 
            {
                "name": "SZCQMC", 
                "type": "VARCHAR2(100)", 
                "comment": "所在城区名称"
            }, 
            {
                "name": "SZJD", 
                "type": "NUMBER(8)", 
                "comment": "所在街道"
            }, 
            {
                "name": "SZJDMC", 
                "type": "VARCHAR2(100)", 
                "comment": "所在街道名称"
            }, 
            {
                "name": "SSSQ", 
                "type": "NUMBER(8)", 
                "comment": "所属社区"
            }, 
            {
                "name": "SSSQMC", 
                "type": "VARCHAR2(100)", 
                "comment": "所属社区名称"
            }, 
            {
                "name": "ZZ", 
                "type": "VARCHAR2(100)", 
                "comment": "住址"
            }, 
            {
                "name": "DWID", 
                "type": "NUMBER(12)", 
                "comment": "工作单位ID"
            }, 
            {
                "name": "DWBH", 
                "type": "VARCHAR2(50)", 
                "comment": "工作单位编号"
            }, 
            {
                "name": "DWMC", 
                "type": "VARCHAR2(100)", 
                "comment": "工作单位名称"
            }, 
            {
                "name": "DWSSHY", 
                "type": "NUMBER(8)", 
                "comment": "单位所属行业"
            }, 
            {
                "name": "ZZQK", 
                "type": "NUMBER(8)", 
                "comment": "在职情况"
            }, 
            {
                "name": "ZYZT", 
                "type": "NUMBER(8)", 
                "comment": "职业状态"
            }, 
            {
                "name": "ZWZC", 
                "type": "NUMBER(8)", 
                "comment": "职务职称"
            }, 
            {
                "name": "CJGZSJ", 
                "type": "DATE", 
                "comment": "参加工作时间"
            }, 
            {
                "name": "GZSJ", 
                "type": "DATE", 
                "comment": "供职时间"
            }, 
            {
                "name": "FGGL", 
                "type": "NUMBER(4,1)", 
                "comment": "房改工龄"
            }, 
            {
                "name": "FGJL", 
                "type": "NUMBER(4,1)", 
                "comment": "房改教龄"
            }, 
            {
                "name": "SNDZSR", 
                "type": "NUMBER(9,2)", 
                "comment": "上年度总收入"
            }, 
            {
                "name": "GJJZH", 
                "type": "VARCHAR2(50)", 
                "comment": "公积金账号"
            }, 
            {
                "name": "CJZH", 
                "type": "VARCHAR2(50)", 
                "comment": "残疾证号"
            }, 
            {
                "name": "CJDJ", 
                "type": "NUMBER(8)", 
                "comment": "残疾等级"
            }, 
            {
                "name": "CJLX", 
                "type": "NUMBER(8)", 
                "comment": "低视力/盲人/上肢/下肢/智力/精神/听力/言语"
            }, 
            {
                "name": "SFJLS", 
                "type": "NUMBER(1)", 
                "comment": "是否军烈属"
            }, 
            {
                "name": "YDDH", 
                "type": "VARCHAR2(100)", 
                "comment": "移动电话"
            }, 
            {
                "name": "LXDH", 
                "type": "VARCHAR2(50)", 
                "comment": "联系电话"
            }, 
            {
                "name": "LXDZ", 
                "type": "VARCHAR2(200)", 
                "comment": "联系地址"
            }, 
            {
                "name": "YZBM", 
                "type": "NUMBER(6)", 
                "comment": "邮政编码"
            }, 
            {
                "name": "DZYJ", 
                "type": "VARCHAR2(100)", 
                "comment": "EMAIL"
            }, 
            {
                "name": "BZ", 
                "type": "VARCHAR2(500)", 
                "comment": "备注"
            }, 
            {
                "name": "SFGFR", 
                "type": "NUMBER(1)", 
                "comment": "是否购房人"
            }, 
            {
                "name": "LSBZ", 
                "type": "NUMBER(8)", 
                "comment": "历史标志"
            }, 
            {
                "name": "CJSJ", 
                "type": "DATE", 
                "comment": "创建时间"
            }, 
            {
                "name": "ZZSJ", 
                "type": "DATE", 
                "comment": "终止时间"
            }, 
            {
                "name": "SFYX", 
                "type": "NUMBER(1)", 
                "comment": "是否有效"
            }, 
            {
                "name": "HTQDSJ", 
                "type": "DATE", 
                "comment": "合同签订时间始"
            }, 
            {
                "name": "HTQDNS", 
                "type": "NUMBER(8)", 
                "comment": "合同签订年数"
            }, 
            {
                "name": "YLBXJNNS", 
                "type": "DATE", 
                "comment": "养老保险交纳时间"
            }, 
            {
                "name": "JNNS", 
                "type": "NUMBER(8)", 
                "comment": "养老保险交纳年数"
            }, 
            {
                "name": "ZFGJJJNSJ", 
                "type": "DATE", 
                "comment": "住房公积金交纳时间"
            }, 
            {
                "name": "ZFGJJJNNS", 
                "type": "NUMBER(8)", 
                "comment": "住房公积金交纳年数"
            }, 
            {
                "name": "SWWSZMQX", 
                "type": "DATE", 
                "comment": "税务完税证明期限"
            }, 
            {
                "name": "WSNS", 
                "type": "NUMBER(8)", 
                "comment": "完税年数"
            }, 
            {
                "name": "ZZZH", 
                "type": "VARCHAR2(50)", 
                "comment": "临时暂住证"
            }, 
            {
                "name": "ZYZG", 
                "type": "NUMBER(8)", 
                "comment": "职业资格"
            }, 
            {
                "name": "ZC", 
                "type": "NUMBER(8)", 
                "comment": "职称"
            }, 
            {
                "name": "BYSJ", 
                "type": "DATE", 
                "comment": "毕业时间"
            }, 
            {
                "name": "HTQDSJZ", 
                "type": "DATE", 
                "comment": "合同签订时间止"
            }, 
            {
                "name": "LRHCFW", 
                "type": "NUMBER(1)", 
                "comment": "列入核查范围（廉租房）"
            }, 
            {
                "name": "SFXZ", 
                "type": "NUMBER(1)", 
                "comment": "是否限制购房"
            }
        ]
    }
];
/*
	function addFile(title,content,htmlName){
		var fso;
		try { 
			fso=new ActiveXObject("Scripting.FileSystemObject"); 
		} catch (e) { 
			alert("当前浏览器不支持,请使用IE浏览器！");
			return;
		}  	
		var openf1 = fso.OpenTextFile("C://Users//Administrator//Desktop//个人博客//html//info_demo.html");
		var html='';
		var f1 = fso.createtextfile("C://Users//Administrator//Desktop//个人博客//html//"+htmlName+".html",true,true);
		while(!openf1.atEndOfLine){
			var str = openf1.ReadLine();
			if(str.indexOf('DemoTitle')>=0){
				str = '<title>'+title+'</title>';
			}
			if(str.indexOf('DemoH3')>=0){
				str = '<h3>'+title+'</h3>';
			}
			if(str.indexOf('col-sm-8')>=0){
				str += content;
			}
			f1.writeLine(str); 
		}	
		openf1.Close();	
		f1.Close();	
		alert('添加成功！');
	}
	*/


//发布文章
function getContent() {
	var title = $("#titleInp").val();
	var content = UM.getEditor('myEditor').getContent();
	var type = $("#hidType").val();
	saveWriting(type,title,content);
}

//保存数据库
function saveWriting(type,title,content){
	var TWriting = Bmob.Object.extend("t_writing");
	var tWriting = new TWriting();
	tWriting.set("groupId", type);
	tWriting.set("title", title);
	tWriting.set("content", content);
	//添加数据，第一个入口参数是null
	tWriting.save(null, {
	  success: function(tWriting) {
		// 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
		alert('添加数据成功，返回的objectId是：' + tWriting.id);
	  },
	  error: function(tWriting, error) {
		// 添加失败
		alert('添加数据失败，返回错误信息：' + error.description);
	  }
	});
}

//查询类别
function queryGroup(){
	var TGroup = Bmob.Object.extend("t_group");
	var query = new Bmob.Query(TGroup);
	// 查询所有数据
	query.find({
	  success: function(results) {
		alert("共查询到 " + results.length + " 条记录");
		// 循环处理查询到的数据
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  alert(object.id + ' - ' + object.get('name'));
		}
	  },
	  error: function(error) {
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}

//处理类别字段
$(document).ready(function(){ 
	$('.dropdown-menu a').click(function(){
		debugger;
		var title = $(this).html();
		$('#dropdownMenu1').html(title);
		var data = $(this).attr('data-info');
		$('#hidType').val(data);
	});
});

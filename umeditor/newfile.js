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
//Bmob.initialize("Application ID", "REST API Key");
Bmob.initialize("81e6a11fc5daa1c7398f8a9f8d8d21f4", "7354929e5b3e06e7c120cb46f1ae7882");

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
		alert('添加数据成功!');
		window.location.reload();
	  },
	  error: function(tWriting, error) {
		// 添加失败
		alert('添加数据失败，返回错误信息：' + error.message);
	  }
	});
}

//查询类别
function queryGroup(){
	var TGroup = Bmob.Object.extend("t_group");
	var query = new Bmob.Query(TGroup);
	// 查询所有数据
	query.ascending("groupId");
	query.find({
	  success: function(results) {
		// 循环处理查询到的数据
		var content='';
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
			content += '<li><a href="javascript:void(0);" onclick="slertType(this);" data-info="'+object.get('groupId')+'">'+object.get('name')+'</a></li>';
		}
		$("#ulType").html(content);
	  },
	  error: function(error) {
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}

//选择下拉框类别
function slertType(obj){
	var title = obj.text;
	$('#dropdownMenu1').html(title);
	var data = obj.getAttribute('data-info');
	$('#hidType').val(data);
}

//查询文章列表
function queryList(){
	var TWriting = Bmob.Object.extend("t_writing");
	var query = new Bmob.Query(TWriting);
	// 查询所有数据
	query.descending("updatedAt");
	query.find({
	  success: function(results) {
		// 循环处理查询到的数据
		var content='';
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
			content += '<div class="recent-single-post">'
							+'		<a href="info_demo.html?id='+object.id+'" class="post-title" target="_blank">'+object.get('title')+'</a>'
							+'		<div class="date">'+object.createdAt+'</div>'
							+'	</div>';
		}
		$("#divList").html(content);
	  },
	  error: function(error) {
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}

//查询文章详细
function queryInfo(id){
	var TWriting = Bmob.Object.extend("t_writing");
	//创建查询对象，入口参数是对象类的实例
	var query = new Bmob.Query(TWriting);
	//查询单条数据，第一个参数是这条数据的objectId值
	query.get(""+id+"", {
	  success: function(gameScore) {
		// 查询成功，调用get方法获取对应属性的值
		debugger;
		var title = gameScore.get("title");
		var content = gameScore.get("content");
		document.title=title; 
		$("#h3Id").html(title);
		$("#divInfo").html(content);
	  },
	  error: function(object, error) {
		// 查询失败
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}


UrlParm = function() { // url参数
	var data, index;
	(function init() {
		data = [];
		index = {};
		var u = window.location.search.substr(1);
		if (u != '') {
			var parms = decodeURIComponent(u).split('&');
			for (var i = 0, len = parms.length; i < len; i++) {
				if (parms[i] != '') {
					var p = parms[i].split("=");
					if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
						data.push(['']);
						index[p[0]] = data.length - 1;
					} else if (typeof(p[0]) == 'undefined' || p[0] == '') { // =c | =
						data[0] = [p[1]];
					} else if (typeof(index[p[0]]) == 'undefined') { // c=aaa
						data.push([p[1]]);
						index[p[0]] = data.length - 1;
					} else {// c=aaa
						data[index[p[0]]].push(p[1]);
					}
				}
			}
		}
	 })();
	 return {
		// 获得参数,类似request.getParameter()
		parm : function(o) { // o: 参数名或者参数次序
			try {
				return (typeof(o) == 'number' ? data[o][0] : data[index[o]][0]);
			} catch (e) {}
		},
		//获得参数组, 类似request.getParameterValues()
		parmValues : function(o) { // o: 参数名或者参数次序
			try {
			return (typeof(o) == 'number' ? data[o] : data[index[o]]);
			} catch (e) {}
		},
		//是否含有parmName参数
		hasParm : function(parmName) {
			return typeof(parmName) == 'string' ? typeof(index[parmName]) != 'undefined' : false;
		},
		// 获得参数Map ,类似request.getParameterMap()
		parmMap : function() {
			var map = {};
			try {
				for (var p in index) { map[p] = data[index[p]]; }
			} catch (e) {}
			return map;
		}
	}
}();


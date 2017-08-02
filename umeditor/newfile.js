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

//保存文章
function saveWriting(type,title,content){
	var TWriting = Bmob.Object.extend("t_writing");
	var tWriting = new TWriting();
	tWriting.set("groupId", type);
	tWriting.set("title", title);
	tWriting.set("content", content);
	tWriting.set("readNum", 0);
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

//保存评论
function saveWritingComm(writingId,comment,name){
	debugger;
	var TWritingComm = Bmob.Object.extend("t_writing_comm");
	var tWritingComm = new TWritingComm();
	tWritingComm.set("writingId", writingId);
	tWritingComm.set("name", name);
	tWritingComm.set("comment", comment);
	//添加数据，第一个入口参数是null
	tWritingComm.save(null, {
	  success: function(tWritingComm) {
		// 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
		window.location.reload();
		alert('评论成功!');
		
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
	//添加查询访客数
	addPeople();
	//通过key来获取value
	var dt = sessionStorage.getItem("writingList");
	if(dt != null){
		$("#divList").html(dt);
		return;
	}	
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
		//添加key-value 数据到 sessionStorage
		sessionStorage.setItem("writingList", content);
	  },
	  error: function(error) {
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}

//添加访客数
function addPeople(){
	var TConfig = Bmob.Object.extend("t_config");
	var query = new Bmob.Query(TConfig);
	// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
	query.get('hom2WWWN', {
    success: function(tConfig) {
		var name = tConfig.get('name');
		var num = tConfig.get('value');
		$("#butPep").html(name+' '+num+' 人');
      // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
      tConfig.set('value', num+1);
      tConfig.save();    
    },
    error: function(object, error) {
		alert("添加访客数失败: " + error.code + " " + error.message);
    }
	});
}

//添加文章详情浏览数
function addInfoNum(id){
	var TWriting = Bmob.Object.extend("t_writing");
	var query = new Bmob.Query(TWriting);
	// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
	query.get(id, {
    success: function(tWriting) {
		var time = sessionStorage.getItem("time"+id);
		var num = tWriting.get('readNum');
		if(num==null||num==''||num=='undefind'){
			num=1;
		}
		$("#h4Time").html(time+'&nbsp;&nbsp;浏览数&nbsp;'+num);
      // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
      tWriting.set('readNum', num+1);
      tWriting.save();    
    },
    error: function(object, error) {
		alert("添加访客数失败: " + error.code + " " + error.message);
    }
	});
}


//查询文章详细
function queryInfo(id){
	//通过key来获取value
	var title = sessionStorage.getItem("title"+id);
	var content = sessionStorage.getItem("content"+id);
	var time = sessionStorage.getItem("time"+id);
	var num = sessionStorage.getItem("num"+id);
	if(title != null && content!=null&& time!=null&&num!=null){
		document.title=title; 
		$("#h3Id").html(title);
		addInfoNum(id);
		$("#divInfo").html(content);
		return;
	}	
	var TWriting = Bmob.Object.extend("t_writing");
	//创建查询对象，入口参数是对象类的实例
	var query = new Bmob.Query(TWriting);
	//查询单条数据，第一个参数是这条数据的objectId值
	query.get(""+id+"", {
	  success: function(gameScore) {
		// 查询成功，调用get方法获取对应属性的值
		var title = gameScore.get("title");
		var content = gameScore.get("content");
		var num = gameScore.get("readNum");
		var time = gameScore.createdAt;
		document.title=title; 
		$("#h3Id").html(title);
		$("#divInfo").html(content);
		$("#h4Time").html(time+'&nbsp;&nbsp;浏览数'+num);
		//存入本地seesion缓存
		sessionStorage.setItem("title"+id,title);
		sessionStorage.setItem("content"+id,content);
		sessionStorage.setItem("time"+id,time);
		sessionStorage.setItem("num"+id,num);
		addInfoNum(id);
	  },
	  error: function(object, error) {
		// 查询失败
		alert("查询失败: " + error.code + " " + error.message);
	  }
	});
}

//查询文章评论列表
function queryCommList(id){	
	var TWritingComm = Bmob.Object.extend("t_writing_comm");
	//创建查询对象，入口参数是对象类的实例
	var query = new Bmob.Query(TWritingComm);
	query.equalTo("writingId", id); 
	// 查询所有数据
	query.find({
		success: function(results) {
			var length = results.length;
			if(length > 0){
				$("#emNum").html(length);
				var content='';
				// 循环处理查询到的数据
				for (var i = 0; i < length; i++) {
				var object = results[i];
				content += '<ul class="list-group"> '
					  +'<li class="list-group-item list-group-item-danger">'
					  +'<div class="text-success"><p><strong>'+ object.get('name')+'&nbsp;&nbsp;&nbsp;&nbsp;'+object.createdAt+'</strong></p></div>'
					  +'<p>'+ object.get('comment')+'</p>'
					  +'</li>'
					+'</ul>';
				}
				$("#divComm").html(content);
				
				
			}
		},
		error: function(error) {
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


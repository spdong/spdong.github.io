function addFile(title,content){
	var fso;
	try { 
		fso=new ActiveXObject("Scripting.FileSystemObject"); 
	} catch (e) { 
		alert("当前浏览器不支持,请使用IE浏览器！");
	return;
	} 
	//var f1 = fso.createtextfile("C:\Users\Administrator\Desktop\个人博客\html\info_demo.html",true);
	//f1.write("这是一个文本文档"); 
	//<!-- 全部写入，不包括回车符 -->
	//f1.writeLine("这是您创建的一个文本文档"); 	
	var openf1 = fso.OpenTextFile("C://Users//Administrator//Desktop//个人博客//html//info_demo.html");
	var html='';
	var f1 = fso.createtextfile("C://Users//Administrator//Desktop//个人博客//html//info_3.html",true,true);
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
}

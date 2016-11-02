var express = require('express');
var superagent = require('superagent');
var events = require("events");

var emitter = new events.EventEmitter();

var app = express();

emitter.on("setCookeie", getTitles);           //监听setCookeie事件
app.get("/",function(req,resp){
	setCookeie();
	resp.write('test');
	resp.end();
});


app.listen(4000,function(req,resp){
    console.log("server is running ......");    
});

function setCookeie () {
  superagent.post('http://www.tuicool.com/login')  //学校里的一个论坛，这是登录提交地址
    .type("form")
      .send({authenticity_token:"YKUIgmwuP14f059XiWd8kFBDvBHcg/XL1UCJ9AkS+l8="})      
      .send({email:"992658560@qq.com"})                                                                                       //这肯定不是我真的用户名和密码啦
      .send({password:"guo123456@"})
      .send({remember:"1"})
      .end(function(err, res){
          if (err) {
        	  throw err;
          } 
          var cookie = res.header['set-cookie'];       //从response中得到cookie
          console.log('#########')
          console.log(cookie);
          console.log('#########')
          emitter.emit("setCookeie", cookie);
        });
}

function getTitles (cookie) {
  superagent.get("http://www.tuicool.com/a/?i=n")             //随便论坛里的一个地址
      .set("Cookie", cookie[0])                 //在resquest中设置得到的cookie，只设置第四个足以（具体情况具体分析）
          .end(function(err, res){
                if (err){
                	throw err;
                }
               console.log(res)
                //do something
          });
}
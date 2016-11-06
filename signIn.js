var express = require('express');
var http = require('http');
var querystring = require('querystring');

var app = express();

var postData = querystring.stringify({
	'currentempoid':'4630021403'
});
var options = {
	hostname: 'kq.neusoft.com',
	port:	80,
	path:	'/record.jsp',
	method:	'POST',
	headers:	{
		'Accept':	'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':	'gzip, deflate',
		'Accept-Language':	'zh-CN,zh;q=0.8',
		'Connection':	'keep-alive',
		'Content-Length':	postData.length,
		'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
		'Cookie':'JSESSIONID=CppDYpyhjhJRSZvjtnlLV9n83G346Gs1LhWNp2DF93KKqW84GSMC!-1309255234; path=/',
		
		'Host':	'kq.neusoft.com',
		'Origin':	'http://kq.neusoft.com',
		'Referer':	'http://kq.neusoft.com/attendance.jsp',
		'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
		'X-Requested-With':	'XMLHttpRequest'
	}
};

function signIn() {
	var req = http.request(options, function(res) {
		console.log('Status:' + res.statusCode);
		console.log('headers:' + JSON.stringify(res.headers));
		res.on('data', function(chunk) {
			console.log(Buffer.isBuffer(chunk));
			console.log(typeof chunk);
		});
		
		res.on('end', function() {
			console.log('打卡 is over!');
		});
		
		res.on('error', function(e) {
			console.log('Error: ' + e.massage);
		});
	});
	req.write(postData);
	req.end();	
	
}

app.get("/",function(req,res){
	signIn();
	res.write('over');
	res.end();
});


app.listen(4000,function(req,resp){
    console.log("server is running at port: 4000......");    
});
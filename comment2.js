var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
	'content': 'scott is cool~',
	'mid':	6705
});

var options = {
	hostname: 'www.imooc.com',
	port:	80,
	path:	'/course/docomment',
	method:	'POST',
	headers:	{
		'Accept':	'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':	'gzip, deflate',
		'Accept-Language':	'zh-CN,zh;q=0.8',
		'Connection':	'keep-alive',
		'Content-Length':	postData.length,
		'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
		'Cookie':	'imooc_uuid=a268a9fa-4d84-43bc-85ee-2b84c36d1b43; imooc_isnew_ct=1471089861; loginstate=1; apsid=FjODNmYjUwNmEwZTE5NjJjNDRhZjNjNDFkODU1Y2YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjU5ODA2MgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5OTI2NTg1NjBAcXEuY29tAAAAAAAAAAAAAAAAAAAAADBjN2FlM2Y1OTA1MDgzYzZlNzYzNWZkMDc1ZjIyNzE1WsL8V1rC%2FFc%3DZj; last_login_username=992658560%40qq.com; PHPSESSID=8tic5d69h2b2nesr8hom6scho3; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1476545417,1476973789,1477112113,1477353909; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1477729885; imooc_isnew=2; cvde=580ea1b52470a-12',
		'Host':	'www.imooc.com',
		'Origin':	'http://www.imooc.com',
		'Referer':	'http://www.imooc.com/video/8837',
		'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
		'X-Requested-With':	'XMLHttpRequest'
	}
};

var req = http.request(options, function(res) {
	console.log('Status:' + res.statusCode);
	console.log('headers:' + JSON.stringify(res.headers));
	res.on('data', function(chunk) {
		console.log(Buffer.isBuffer(chunk));
		console.log(typeof chunk);
	});
	
	res.on('end', function() {
		console.log('评论 is over!');
	});
	
	res.on('error', function(e) {
		console.log('Error: ' + e.massage);
	});
});

req.write(postData);
req.end();
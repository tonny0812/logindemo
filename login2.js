var express = require('express');
var http = require('http');
var schedule = require("node-schedule");
var cheerio = require('cheerio');
var superagent = require('superagent');
var events = require("events");
var querystring = require('querystring');
var moment = require('moment');

var app = new express();
var emitter = new events.EventEmitter();

var userInfo = {
	username: 'guo_dq',
	passwd: 'gdq258812GH'
}
var kqUrl = 'http://kq.neusoft.com';
var loginBeforeInfo = {
		inputUsername: '',
		inputPasswdname: '',
		timestamp: '',
		timeKey: '',
		neusoft_key: '',
		cookie: ''
	};

function getLoginPageInfo(logIn) {
	var req = http.get("http://kq.neusoft.com/index.jsp", function(res) { 
		var cookie = res.headers['set-cookie'][0];
		var html = '';
		res.on('data', function(data) {
			html += data;
		});
		res.on('end', function() {
			var info = filterLoginInfo(html, cookie);
			//console.log(info);
			logIn();
		});
	});
	req.on('error', function(e) {
		console.log('error');
	});
}

function filterLoginInfo(html, cookie) {
	var $ = cheerio.load(html);
	var chapters = $('.eleWrapper');
	chapters.each(function(item) {
		var $div = $(this);
		var $input = $div.find('input');
		if($input.attr('type') === 'text') {
			loginBeforeInfo.inputUsername = $input.attr('name') + '';
			if('' === loginBeforeInfo.timestamp) {
				var strs = loginBeforeInfo.inputUsername.split('!');
				loginBeforeInfo.timestamp = strs[strs.length-1];
				loginBeforeInfo.timeKey = 'KEY' + loginBeforeInfo.timestamp;
			}
		} else {
			loginBeforeInfo.inputPasswdname = $input.attr('name')  + '';
		}
	});
	var neusoft_key = $('input[name="neusoft_key"]').val();
	loginBeforeInfo.neusoft_key = neusoft_key;
	loginBeforeInfo.cookie = cookie.split(';')[0];
	return loginBeforeInfo;
}

function filterCurrentempoid(html) {
	var $ = cheerio.load(html);
	var result = $('input[name="currentempoid"]').val();
	//console.log("####" + result);
	return result;
}

function logIn () {
	var postData = {};
	postData['login'] = "true",
	postData['neusoft_attendance_online'] = "";
	postData['neusoft_key'] = loginBeforeInfo.neusoft_key;
	postData[loginBeforeInfo.timeKey] = "";
	postData[loginBeforeInfo.inputUsername] = userInfo.username;
	postData[loginBeforeInfo.inputPasswdname] = userInfo.passwd;
	var headers = {
		'Accept':	'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding':	'gzip, deflate',
		'Accept-Language':	'zh-CN,zh;q=0.8',
		'Cache-Control' :	'no-cache',
		'Connection':	'keep-alive',
		'Content-Length':	querystring.stringify(postData).length,
		'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
		'Host':	'kq.neusoft.com',
		'Cookie': loginBeforeInfo.cookie,
		'Origin':	'http://kq.neusoft.com',
		'Pragma':	'no-cache',
		'Referer':	'http://kq.neusoft.com/index.jsp',
		'Upgrade-Insecure-Requests':	1,
		'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
	}
 	superagent.post(kqUrl+'/login.jsp')  //登录提交地址
	    .type("form")
	      .send(querystring.stringify(postData))
	      .set(headers)
	      .end(function(err, res){
	          if (err) {
	        	  throw err;
	          } 
	          //signIn(res.text);
	          signInSuperAgent(res.text);
       	 });
}



function signIn(html) {
	var currentempoid = filterCurrentempoid(html);
	var postData = querystring.stringify({
		'currentempoid':currentempoid
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
				'Cookie':	loginBeforeInfo.cookie,
				'Host':	'kq.neusoft.com',
				'Origin':	'http://kq.neusoft.com',
				'Referer':	'http://kq.neusoft.com/attendance.jsp',
				'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
				'X-Requested-With':	'XMLHttpRequest'
			}
	};
	var req = http.request(options, function(res) {
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

function signInSuperAgent(html) {
	var currentempoid = filterCurrentempoid(html);
	var postData = querystring.stringify({
		'currentempoid':currentempoid
	});
	var headers = {
			'Accept':	'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding':	'gzip, deflate',
			'Accept-Language':	'zh-CN,zh;q=0.8',
			'Connection':	'keep-alive',
			'Content-Length':	postData.length,
			'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
			'Cookie':	loginBeforeInfo.cookie,
			'Host':	'kq.neusoft.com',
			'Origin':	'http://kq.neusoft.com',
			'Referer':	'http://kq.neusoft.com/attendance.jsp',
			'User-Agent':	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
			'X-Requested-With':	'XMLHttpRequest'
		}
	superagent.post(kqUrl+'/record.jsp')
      .send(postData)
      .set(headers)
      .end(function(err, res){
          if (err) {
        	  console.log('Error: ' + err.massage);
        	  throw err;
          }
          console.log('打卡 结束!');
   	 });
}

/*var dakaRule = new schedule.RecurrenceRule();
dakaRule.dayOfWeek = [0, new schedule.Range(1, 5)];
dakaRule.hour = 8;*/

var rule = new schedule.RecurrenceRule();
var times = [];
　　for(var i=1; i<60; i++){

　　　　times.push(i);

　　}
　　rule.minute = times;

var test = schedule.scheduleJob(rule, function() {
	var firstDakaMoment = new moment();
	console.log(firstDakaMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a'))
	var seconds = (firstDakaMoment.seconds() + 5) % 60;
	var firstDakaRule = new Date(firstDakaMoment.year(), firstDakaMoment.month(), firstDakaMoment.date(), firstDakaMoment.hour(), firstDakaMoment.minute(), seconds);
	var first = schedule.scheduleJob(firstDakaRule, function() {
		var currentMoment =  new moment();
		console.log('#######' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a'));
		first.cancel();
	});
});

/**
var daka = schedule.scheduleJob(rule, function() {
	
	var firstDakaMoment = new moment();
	firstDakaMoment.hour(8);
	firstDakaMoment.minute(RandomNumBoth(45, 55));
	firstDakaMoment.second(createRandomInteger(59));
	var firstDakaRule = new Date(firstDakaMoment.year(), firstDakaMoment.month(), firstDakaMoment.date(), firstDakaMoment.hour(), firstDakaMoment.minute(), firstDakaMoment.second());
	
	var secondDakaMoment = new moment();
	secondDakaMoment.hour(18);
	secondDakaMoment.minute(RandomNumBoth(30, 45));
	secondDakaMoment.second(createRandomInteger(59));
	var secondDakaRule = new Date(secondDakaMoment.year(), secondDakaMoment.month(), secondDakaMoment.date(), secondDakaMoment.hour(), secondDakaMoment.minute(), secondDakaMoment.second());	
		
	var first = schedule.scheduleJob(firstDakaRule, function() {
		var currentMoment =  new moment();
		getLoginPageInfo(logIn);
		console.log(userInfo.username + ':' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a') + '第一次打卡');
		first.cancel();
	});
	
	var second = schedule.scheduleJob(secondDakaRule, function(){
		var currentMoment =  new moment();
		getLoginPageInfo(logIn);
		console.log(userInfo.username + ':' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a') + '第二次打卡');
		second.cancel();
	});
});
**/
function createRandomInteger(range) {
	if(isNaN(range) || range=="" || range > 60 || range < 0) {
		range = 60;
	}
	var num = Math.random() * range;
	return Math.floor(num);
}

function RandomNumBoth(Min,Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}

app.get('/', function(req, res) {
	var currentMoment =  new moment();
	getLoginPageInfo(logIn);
	res.write('login at ' + currentMoment.format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a'));
	res.end();
}).listen(3000,function(req,resp){
	console.log(new moment().format('MMMM Do dddd YYYY-MM-DD, h:mm:ss a'))
    console.log("server is running at port: 3000......");    
});;
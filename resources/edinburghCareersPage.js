var request = require("request");
var cheerio = require("cheerio");
var querystring = require("querystring");
var Cookie = require('request-cookies');
var async  = require('async');
var Site = require("./Site");

let cookieJar = new Cookie.CookieJar();

function login(callback){
	let form = {
		'login': 's1760196',
		'password': 'Edinburgh2079136',
		'submit' : 'Login now'
	};
	let formData = querystring.stringify(form); 
	request.get({
		url: 'https://www.ease.ed.ac.uk/cosign.cgi',
		jar: cookieJar
	}, function(err, res, html){
			let loginCookie = new Cookie.Cookie(res.headers["set-cookie"][0]);
			cookieJar.add(loginCookie, 'https://www.ease.ed.ac.uk/cosign.cgi');
			//cookieJar.add(loginCookie, 'https://mycareerhub.ed.ac.uk/');
			
			request.post({
				url: 'https://www.ease.ed.ac.uk/cosign.cgi',
				headers: {
					'Content-Type' : 'application/x-www-form-urlencoded',
					'Connection' : 'keep-alive'
				},
				body: formData,
				jar: cookieJar,
				}, function(err, response, html){
					console.log(response.headers["set-cookie"][0]); 	
					callback(null);
				}
		);
	});
};

function retrievePage(callback){
	request.get({
		url: 'https://mycareerhub.ed.ac.uk/',
		jar: cookieJar
		}, 
		function(err, res, html){
			//console.log(html);
			callback(null);
		});
};

async.series([
		login,
		retrievePage
	]);
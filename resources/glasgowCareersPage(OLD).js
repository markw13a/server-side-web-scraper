var request = require("request");
var cheerio = require("cheerio");
var querystring = require("querystring");
var Cookie = require('request-cookies');
var async  = require('async');
var Site = require("./Site");

let cookieJar = new Cookie.CookieJar();

function login(callback){
	let form = {
		'user.username': 'markw13a@gmail.com',
		'user.password': '142942492a!'
	};
	let formData = querystring.stringify(form); 

	request.post({
		url: 'https://glasgow.targetconnect.net/graduate/login.html',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		body: formData,
		jar: cookieJar,
		}, function(err, response, html){
			let loginCookie = new Cookie.Cookie(response.headers["set-cookie"][0]);
			cookieJar.add(loginCookie, 'https://glasgow.targetconnect.net');
			callback(null);
		}
	);
};

function retrievePage(callback){
	request.get({
		url: 'https://glasgow.targetconnect.net/graduate/jobSearch.html?execution=e1s1',
		jar: cookieJar
		}, 
		function(err, res, html){
			console.log(html);
			callback(null);
		});
};

async.series([
		login,
		retrievePage
	]);
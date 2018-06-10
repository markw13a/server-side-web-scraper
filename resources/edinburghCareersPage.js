var request = require("request");
var cheerio = require("cheerio");
var querystring = require("querystring");
var Cookie = require('request-cookies');
var async  = require('async');
const puppeteer = require("puppeteer");
var Site = require("./Site");
const C = require("./credentials");

//Puppeteer options, for debugging
const options = {
	headless: true,
	devTools: true,
	slowMo: 0
};

async function extractInfo() {
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	
	await login({page});
	await page.waitFor(2000);
	await page.goto('https://mycareerhub.ed.ac.uk/students/jobs/search?page=1&take=10000');
	const jobArray = await page.evaluate(retrieveJobInfoFromPage);
	//Deadline needs to be returned from browser context as JSON. Convert into a Date object here
	jobArray.deadline = new Date(jobArray.deadline);
	await browser.close();
	
	return jobArray;
}

//Don't actually need to bother setting this.
//System is more flexible that it first appears: 
//need only have exractInfo() return an array of strings containing 
//info on the job listing
async function extractHTML() {
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await login({page});
	await page.waitFor(2000);
	await page.goto('https://mycareerhub.ed.ac.uk/students/jobs/search?page=1&take=10000');
	const contents = await page.$eval('html', e => e.outerHTML);
	await browser.close();
	return contents;
}

async function login({page}) {
	await page.goto('https://mycareerhub.ed.ac.uk/students/login?ReturnUrl=%2f');
	await page.click('body > div.main > div > div > div > div.sparse-body.auth-body > div > div.external-auth > div > div > div > a');
	await page.waitForSelector('#login');
	
	await page.click('#login');
	await page.keyboard.type(C.Edinburgh.login);
	await page.click('#password');
	await page.keyboard.type(C.Edinburgh.password);
	await page.click('#contentArea > div > div.infoItem.wide.hi > form > div:nth-child(3) > input[type="submit"]:nth-child(1)');
}

//Pretty messy, but it's less awkward than attempting to return and work with a NodeList
//Note that Date object is returned as JSON: can't just return a complete object from the browser context
function retrieveJobInfoFromPage() {
	const jobInfo = [];
	const nodeList = document.querySelectorAll('div.list-group-item');
	//String padding/foreign characters is messing with Fuse. Simplest solution is to check for and remove these
	const cleanString = string => {
		string = string.replace(/\s{2,}/g, '');
		string = string.replace('\n', '');
		return string;
	};
	const createDeadline = node => {
		if (node.querySelector('div.job-list-close > span')){
			const deadline = new Date(node.querySelector('div.job-list-close > span').innerHTML);
			if(deadline instanceof Date && !isNaN(deadline)) return deadline.toJSON();
		}
		return new Date('January 1, 2161').toJSON();
	};
	for(let i=0; i<nodeList.length; i++) {
		const node = nodeList[i];
		const jobDetails = {
			jobTitle: node.querySelector('div.list-group-item-heading > h4 > a') ? cleanString(node.querySelector('div.list-group-item-heading > h4 > a').innerHTML) : null,
			website: node.querySelector('div.list-group-item-heading > h4 > a') ? 'https://mycareerhub.ed.ac.uk'+node.querySelector('div.list-group-item-heading > h4 > a').getAttribute('href') : null,
			salary: null,
			jobLocation: node.querySelector('div.job-list-location > div > em') ? cleanString(node.querySelector('div.job-list-location > div > em').innerHTML) : null,
			deadline: createDeadline(node),
			company: node.querySelector('div.list-group-item-heading > h5 > *') ? cleanString(node.querySelector('div.list-group-item-heading > h5 > *').innerHTML) : null,//Sometimes in <a>, sometimes in <span>
		};
		jobInfo.push(jobDetails);
	}
	return jobInfo;
}

module.exports.scrape = (siteObjects) => {
	const newSite = new Site('https://mycareerhub.ed.ac.uk');
	newSite.setExtractRelevantInfo(extractInfo);
	newSite.extractHTML = () => '';//Actually never used. Only purpose is to avoid siteScraper making a pointless AJAX call to the career's site
	return siteObjects.push(newSite);
}
	

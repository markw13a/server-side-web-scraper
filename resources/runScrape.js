//Want to have a function .run([Sites]) that can be called from an external function. Really shouldn't have underlying workings and current use to scrape Gradcracker rolled into one file. Very messy.
//Possible to reduce number of variables in the global scope? Tricky due to difficulty of passing arguments to async.waterfall
//Could we use a promise object to eliminate the need for an event emitter?
var cheerio = require("cheerio");
var Site = require('./Site');
var runJobSearch = require('./siteScraper');

//List of URLs from which to populate job database
let gradCrackURL = 'https://www.gradcracker.com/search/engineering-graduate-jobs';
let siteObjects = [];

function gradCrackerExtractor(){	
	let site = this.getURL();
	let html = this.getHTML();
	//'div[class=tbl]'
	let $ = cheerio.load(html);
	let outArray = [];

	//Find salaries & location
	$('.e-result,.e-item').each(function(i, ele){
		//console.log($(this).html());
		let jobInfoCard = $(this);
		let miscInformation = jobInfoCard.find('div:nth-child(3)').html();
		let imageLink = jobInfoCard.find('div > div > div > div > a').attr().href;
		let jobPageLink = jobInfoCard.find('div > div > div > h2 > a').attr().href;
		//As Salary, location and closing date are not included within DOM for Gradcracker, forced to use regex to extract this information
		let salaryRegEx = /Salary:<\/strong>(.*)<br>/;
		let locationRegEx = /<strong>Location:<\/strong>(.*)<br>/;
		let deadlineRegEx = /<strong>Closing Date:<\/strong>([\s\S]*?)<\/div>/;
 
		let newJobObj = {
			 jobTitle: null, 
			 salary: null,
			 jobLocation: null,
			 website: null,
			 deadline: null,
			 company: null
		}
		newJobObj.jobTitle = jobInfoCard.find('h2[class=opportunity-title] > a').html();
		newJobObj.salary = miscInformation.match(salaryRegEx)[1];
		newJobObj.jobLocation = miscInformation.match(locationRegEx)[1];
		newJobObj.website = jobPageLink;
		newJobObj.deadline = miscInformation.match(deadlineRegEx) ? toDate(miscInformation.match(deadlineRegEx)[1]) : new Date('January 1, 2161');
		newJobObj.company  = extractCompanyNameFromURL(imageLink);
		
		
		outArray.push(newJobObj);
	});

	return(outArray);
};
//Name of company is not directly listed for Gradcracker job postings: images are used instead. I still need the company's name for a later database query, and it turns out that the only reference to the the company's name on the entire job posting is as an argument to an internal link.
//Output names will be in lower-case with all hyphens removed.
function extractCompanyNameFromURL(url){
	//Example urls:
	//https://www.gradcracker.com/hub/528/mace-group
	//https://www.gradcracker.com/hub/3/mott-macdonald
	//https://www.gradcracker.com/hub/236/bank-of-america-merrill-lynch
	//Want to extract and clean name at the end
	let regEx = /[0-9]\/(.*)/;
	let companyName = url.match(regEx)[1];
	companyName = companyName.replace(/-/g, ' ');
	
	return companyName;
};

//Takes in closing date and returns as a valid Date object.
//Purpose of function is to deal with invalid date inputs used on some sites such as "Today"
function toDate(date){
	let dateObject = new Date(date);
	
	//Check if dateObject is a valid date
	if(isNaN(dateObject.getTime())){
		
		if(date.includes('Today')){
			dateObject = new Date();
		}
		else{
			//Default return object
			dateObject = new Date('January 1, 2161');
		}
		
	}
	
	return dateObject;
};


for(let i =0; i < 16; i++){
	let newSite = new Site(gradCrackURL + "?page=" + i);
	newSite.setExtractRelevantInfo(gradCrackerExtractor);
	siteObjects.push(newSite);
}

runJobSearch(siteObjects);
//Want to have a function .run([Sites]) that can be called from an external function. Really shouldn't have underlying workings and current use to scrape Gradcracker rolled into one file. Very messy.
//Possible to reduce number of variables in the global scope? Tricky due to difficulty of passing arguments to async.waterfall
//Could we use a promise object to eliminate the need for an event emitter?
var cheerio = require("cheerio");
var Site = require('./Site');
var runJobSearch = require('./siteScraper');

//List of URLs from which to populate job database
let gradCrackURL = 'https://www.gradcracker.com/search/engineering-graduate-jobs';

function gradCrackerExtractor(){	
	let site = this.getURL();
	let html = this.getHTML();
	
	let $ = cheerio.load(html);
	let outArray = [];
	//For each 'company card'. Cards contain list of jobs on offer by company
	$('.e-result.e-item').each(function(i, ele){
		let companyCard = $(this);
		let companyName = extractCompanyNameFromURL(companyCard.find('.row:nth-child(1) > div > div > div > a').attr().href);
		let numberOfJobsOnCard = companyCard.find('h2[class=opportunity-title]').length;
		let jobSubArray = new Array(numberOfJobsOnCard);
		
		//Process assumes that for every "'h2[class=opportunity-title]'", there is a div containing information on the job. Will break down if this is not true.
		//Go through divs containing job title
		companyCard.find('h2[class=opportunity-title]').each(function(i, ele){
			let newJobObj = {
				 jobTitle: null, 
				 salary: null,
				 jobLocation: null,
				 website: null,
				 deadline: null,
				 company: null
			};
			
			newJobObj.company = companyName;
			newJobObj.jobTitle = $(this).find('h2[class=opportunity-title] > a').html();
			newJobObj.website = $(this).find('h2[class=opportunity-title] > a').attr().href;
			jobSubArray[i] = newJobObj;
		});
		
		//Go through div containing job information, and update previously created jobSubArray entry
		//This is pretty convoluted, but gradcracker's current (13/03/18) DOM setup makes it quite difficult to do this as one loop
		companyCard.find('.opp-overview.clearfix').each(function(i, ele){
			//Maybe makes more sense to instantiate these outside of the loop, but this feels tidier
			let salaryRegEx = /Salary:<\/strong>(.*)<br>/;
			let locationRegEx = /<strong>Location:<\/strong>(.*)<br>/;
			let deadlineRegEx = /<strong>Closing Date:<\/strong>([\s\S]*?)<\/div>/;
			let miscInformation = $(this).html();
			
			jobSubArray[i].salary = miscInformation.match(salaryRegEx)[1];
			jobSubArray[i].jobLocation = miscInformation.match(locationRegEx)[1];
			jobSubArray[i].deadline = miscInformation.match(deadlineRegEx) ? toDate(miscInformation.match(deadlineRegEx)[1]) : new Date('January 1, 2161');
		});
		
		outArray = outArray.concat(jobSubArray);
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

module.exports.scrape = function(siteObjects){
	for(let i =1; i <= 1; i++){
		let newSite = new Site(gradCrackURL + "?page=" + i);
		newSite.setExtractRelevantInfo(gradCrackerExtractor);
		siteObjects.push(newSite);
	}
	return siteObjects;
}
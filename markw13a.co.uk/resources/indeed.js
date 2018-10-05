// needed to use puppeteer here as most of page is built via javascript
// can't just read from request HTML
const puppeteer = require("puppeteer");
var Site = require("./Site");

//Puppeteer options, for debugging
const options = {
	headless: true,
	devTools: true,
	slowMo: 0
};

const indeedURL = 'https://www.indeed.co.uk/jobs?q=graduate+%C2%A320%2C000%2B&l=Scotland&radius=100&limit=50&sr=directhire';

async function extractInfo() {
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
    
	await page.goto(this.getURL());// will run in Site Object context
	const jobArray = await page.evaluate(retrieveJobInfoFromPage);
	//Deadline needs to be returned from browser context as JSON. Convert into a Date object here
	jobArray.deadline = new Date(jobArray.deadline);
	await browser.close();
	
	return jobArray;
}

//Pretty messy, but it's less awkward than attempting to return and work with a NodeList
//Note that Date object is returned as JSON: can't just return a complete object from the browser context
function retrieveJobInfoFromPage() {
	const jobInfo = [];
	const nodeList = document.querySelectorAll('.clickcard');


    //String padding/foreign characters is messing with Fuse. Simplest solution is to check for and remove these
    const cleanString = string => {
        string = string.replace(/\s{2,}/g, '');
        string = string.replace('\n', '');
        string = string.replace(/<.*?>/g, '');// get rid of html tags
        return string;
    };

    // some inconsistency around how indeed embeds the job title element into the page
    const getJobInfo = node => {
        const withh2 = node.querySelector('h2.jobtitle');
        const inlink = node.querySelector('a.jobtitle');

        const details = {
            jobTitle: null,
            website: null,
            salary: node.querySelector('td.snip > div > span.no-wrap') ? node.querySelector('td.snip > div > span.no-wrap').innerHTML : null,
            company: cleanString(node.querySelector('span.company > a') ? node.querySelector('span.company > a').innerHTML : node.querySelector('span.company').innerHTML),
            deadline: new Date('January 1, 2161').toJSON(), // indeed does not carry this information
            location: node.querySelector('span.location')
        };

        // jobtitle and website can be embedded in one of two ways
        if(withh2) {
            details.jobTitle = cleanString(node.querySelector('h2.jobtitle > a').innerHTML);
            details.website = 'https://www.indeed.co.uk' + node.querySelector('h2.jobtitle > a').getAttribute('href')
        }
        if(inlink) {
            details.jobTitle = cleanString(inlink.innerHTML);
            details.website = 'https://www.indeed.co.uk' + inlink.getAttribute('href');
        }    

        return details;
    };

	for(let i=0; i<nodeList.length; i++) {
		const node = nodeList[i];
		jobInfo.push(getJobInfo(node));
	}
	return jobInfo;
}

module.exports.scrape = () => {
    const siteObjects = [];

    //NB: Indeed won't load any jobs past 950-1000
    // claims to have more results, but these are not accessible
    for(let i = 0; i < 1; i++) {
        console.warn(i);
        const newSite = new Site(indeedURL + '&start=' + i * 50);
        newSite.setExtractRelevantInfo(extractInfo);
        newSite.extractHTML = () => '';//Actually never used. Only purpose is to avoid siteScraper making a pointless AJAX call to the career's site
        siteObjects.push(newSite);
    }

	return siteObjects;
}

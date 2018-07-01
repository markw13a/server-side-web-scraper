const request = require('request');
const https = require('https');
const Site = require('./Site');

const apiEndpoint = 'https://www.prospects.ac.uk/api/jobs?page=0&size=1000&sortBy=dp';

async function extractor(){

    //Need to wrap in Promise in order to use await
    const rawJobData = await new Promise((resolve, reject) => {
        request({url: apiEndpoint, json: true}, async (err, res, body)=> {
            if(err) {
                console.error("Error connecting to prospects.ac.uk", err);
                return reject(err);
            } 
            return resolve(body);
        })
    });
    const jobData = rawJobData.jobs.map(job => {
        return {
            jobTitle: job.title, 
            salary: job.salary.text,
            jobLocation: job.location.reduce((s, loc)=>s+= s? `, ${loc.text}` : loc.text, ''),
            website: constructURL(job),
            deadline: job.closingDate ? new Date(job.closingDate) : new Date('January 1, 2161'),
            company: job.employer.name
       };
    });
    ///employer-profiles/santoro-ltd-27972/jobs/product-development-assistant-2638452
    return jobData;
}

const constructURL = job => {
    let URL = 'https://www.prospects.ac.uk/';
    if(job.employerSlug) URL += `employer-profiles/${job.employerSlug}-${job.employerKeyword.tnr}/jobs/` 
    else {URL += 'graduate-jobs/'}
    return `${URL}${job.jobSlug}-${job.id}`
};

module.exports.scrape = function(siteObjects) {
    let newSite = new Site(apiEndpoint);
    newSite.setExtractRelevantInfo(extractor);
    newSite.extractHTML = () => '';
    siteObjects.push(newSite);
    return siteObjects;
}
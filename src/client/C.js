const updateQueryParam = (queryParameter, value) => {
	let currentURL = window.location.href;
    
    //Argument already present in URL
	if(currentURL.includes(queryParameter)){
		const regEx = new RegExp(queryParameter+"(=.*)(?=\\&)|" + queryParameter + "(=.*)");
		return currentURL.replace(regEx, queryParameter+"="+value);
    }
    //URL has unrelated arguments
	else if(currentURL.includes("?")){
		return currentURL + "&" + queryParameter + "=" + value;
    }
    //URL has no arguments
	else{
		return currentURL + "?" + queryParameter + "=" + value;
	}
}

/**
 * Shamelessly stolen 
 */
function getUrlParameter(url, param) {
    param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Performs an in-place sort by category
 * Not too keen on inplace sorts. Look to change this 
 */
function sortByCategory(category, array){
	switch(category){
		case "jobTitle":
			array.sort(titleComparison);
			break;
			
		case "company":
			array.sort(companyComparison);
			break;
			
		case "location":
			array.sort(locationComparison);
			break;
			
		case "salary":
			array.sort(salaryComparison);
			break;
			
		case "website":
			array.sort(websiteComparison);
			break;
		
		case "deadline":
			array.sort(deadlineComparison);
			break;
		default:
			break;
	};
};

function titleComparison(a, b){
	let titleA = a.jobTitle;
	let titleB = b.jobTitle;
	
	if(titleA < titleB){
		return -1;
	}
	else{
		return 1;
	}
};

function companyComparison(a, b){
	let companyA = a.companyName;
	let companyB = b.companyName;
	
	if(companyA < companyB){
		return -1;
	}
	else{
		return 1;
	}
};

function salaryComparison(a, b){
	let salaryA = a.salary;
	let salaryB = b.salary;
	
	//Simple comparison might not be the most sensible for this (salaries gives are often a mix of text and numbers), but it'll do for the moment.
	if(salaryA < salaryB){
		return 1;
	}
	else{
		return -1;
	}
}

function locationComparison(a, b){
	let locationA = a.jobLocation;
	let locationB = b.jobLocation;
	
	if(locationA < locationB){
		return -1;
	}
	else{
		return 1;
	}
};

function websiteComparison(a, b){
	let websiteA = a.website;
	let websiteB = b.website;
	
	if(websiteA < websiteB){
		return -1;
	}
	else{
		return 1;
	}
};

function deadlineComparison(a, b){
	let deadlineA = a.deadline;
	let deadlineB = b.deadline;
	
	if(deadlineA < deadlineB){
		return -1;
	}
	else{
		return 1;
	}
};


module.exports = {
	updateQueryParam,
	getUrlParameter,
    sortByCategory
};

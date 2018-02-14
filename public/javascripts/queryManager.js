/*This file is intended to manage query paramaters sortBy and query.
With the previous setup, clicking one of the table headers to sort the jobs list would bring you back to the initial -- unfiltered -- results
Had considered including sort options as part of the search form, but decided that this was too inflexible: if you wished to sort by a different quantity after submission, you would need to reenter your search query.
This script should mean that sortBy and query can be altered independent of each other.
*/

//Two arguments: query parameter to be altered, value provided for this
function queryManager(queryParameter, value){
	let currentURL = window.location.href;
	let regEx;
	
	if(currentURL.includes(queryParameter)){
		regEx = new RegExp(queryParameter+"(=.*)(?=\\&)|" + queryParameter + "(=.*)");
		window.location.href = currentURL.replace(regEx, queryParameter+"="+value);
	}
	else if(currentURL.includes("/?")){
		window.location.href = currentURL + "&" + queryParameter + "=" + value;
	}
	else{
		window.location.href = currentURL + "?" + queryParameter + "=" + value;
	}
}
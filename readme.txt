Now have a working prototype for a server-based version of our previous "web-scraper" project.

It's a bit primitive, as this is my first complete web app, but I intend to continue working on it.

Added functionality:
->All JavaScript has now been moved to the server-side.
->The project now makes use of an off-site NoSQL database
->Currently only set to read from gradcracker.com, but adding new sites is quite straightforward 

Managed to solve the problem of inexact matches (companies being known by different names in different places) by using a "fuzzy matching" module called "fuse.js". Haven't yet had a chance to properly calibrate this, but I would say that it correctly identifies a company able to sponsor a tier 2 visa about 90% of the time. This does, however, mean that our database will sometimes reject jobs that could well provide sponsorship for a visa or accept jobs that can't.

While there remains a lot of work to do, the front-end is just a default HTML table at the minute, I am quite happy with the results so far.

TO DO:
-> Clean up main "scrapeTest.js" file: make it easier to read and interact with.
-> Make a half-decent looking page to display data from our database.
-> Add more websites for our scraping-bot to trawl.
-> Add ability for user to sort data by different criteria (job title, salary, location, company name).
-> Find a host for the website.
const express = require('express');
const credentials = require('../resources/credentials');
const {getDB} = require('../resources/C');

const router = express.Router();
const adminPassword = credentials.rest.password;

// retrieve  item from back-end
router.get('/get*', (req, res) => {
    const pathname = req._parsedOriginalUrl.pathname || '';
    // return entire collection if a specific article title is not given
    const articleID = pathname.match(/get\/([^\/]*$)/);

    getDB()
    .then( db => {
        const collection = db.db("translation").collection("articles");

        if(articleID && articleID[1]) {
            return collection.find({'endpointTitle': articleID[1]});
        }
        // return entire collection if a specific article title is not requested
        return collection.find({});
    }) // need to convert MongoDB object to array
    .then( results => results.toArray())
    .then( data => res.json({data}));
});

// form for creating new article
router.get('/create', (req, res) => {
	res.render('react-index');
});

// write item to back-end if correct password provided
router.post('/create', (req, res) => {
    const {password} = req.body;    
    // db could still be a promise at this stage.
    const db = getDB();

    // console.warn(db.resolved);
    // {
    //     endpoint-title: "",
    //     target-language: {language: "en", title: "...", text: "..."}
    //     source-language: {language: "es", title: "...", text: "..."}
    //     link: "..." // link to original text
    // }

    if(password !== adminPassword) res.send('Incorrect Password. New item not created')

    // Create entry for item in back-end 
    db.then( v => {
        const collection  = v.db("translation").collection("articles");
        
        const articleData = req.body;
        // don't want to save password to db!
        delete articleData.password;

        collection.save(articleData);
    });
    
    // Success. Link to new asset's endpoint
    res.send('Item successfully created');
});

// form for deleting article
router.get('/delete*', (req, res) => {
	res.render('react-index');
});

router.post('/delete*', (req, res) => {
    const {password, articleID} = req.body;
    console.warn(articleID);
    // db could still be a promise at this stage.
    const db = getDB();

    if(password !== adminPassword) res.send('Incorrect Password. Item not deleted')

    db.then( v => {
        const collection  = v.db("translation").collection("articles");
        
        if(articleID) {
            collection.remove({'endpointTitle': articleID}, {justOne: true});
            res.send('Item deleted.');
            return;
        }
        res.send('No valid article ID provided. No action taken.');
    });
});

module.exports = router;

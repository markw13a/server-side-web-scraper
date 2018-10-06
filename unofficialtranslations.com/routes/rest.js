const express = require('express');
const credentials = require('../resources/credentials');

const router = express.Router();
const adminPassword = credentials.rest.password;

// form for creating new article
router.get('/', (req, res) => {
	res.render('react-index');
});

// retrieve  item from back-end
router.get('/create', (req, res) => {
    console.warn("GET", req);
});

// write item to back-end if correct password provided
router.post('/create', (req, res) => {
    const {
        password,
        link, 
        targetLanguageText, 
        targetLanguageTitle,
        sourceLanguageText,
        sourceLanguageTitle,
        endpointTitle
    } = req.body;
    console.warn(req);
    // {
    //     endpoint-title: "",
    //     target-language: {language: "en", title: "...", text: "..."}
    //     source-language: {language: "es", title: "...", text: "..."}
    //     link: "..." // link to original text
    // }

    if(password !== adminPassword) res.send('Incorrect Password. New item not created')
    
    // Create entry for item in back-end 

    // Success. Link to new asset's endpoint
    res.send('Item successfully created');
});

module.exports = router;

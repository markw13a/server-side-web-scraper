var express = require('express');
const React = require('react');
var opportunitiesController = require('../controllers/opportunitiesController');
import {renderToString} from 'react-dom/server'; 
import NavBar from '../src/client/components/NavBar';
import {JobListings} from '../src/client/components/JobListings';

const router = express.Router();

router.get('/', opportunitiesController.index);

//Issue with render interpreting markup as name of file in views directory
router.get('/react-test', (req, res) => {
    res.render('react-index');
    // const navBarMarkup = renderToString(<NavBar />);
    // const jobListingsMarkup = renderToString(<JobListings req={req} />);
    // res.send("<div>" + navBarMarkup + jobListingsMarkup + "</div>");
});

module.exports = router;

var express = require('express');
var opportunitiesController = require('../controllers/opportunitiesController');
const ReactView = require('../components/react-view');
const React = require('react');
import {renderToString} from 'react-dom/server'; 

const router = express.Router();

router.get('/', opportunitiesController.index);

//Issue with render interpreting markup as name of file in views directory
router.get('/react-test', (req, res) => {
    const markup = renderToString(<ReactView />);
	res.send(markup);
});

module.exports = router;

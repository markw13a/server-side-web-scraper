const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.get('/opportunities', dataController.opportunities);

module.exports = router;

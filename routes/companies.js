var express = require('express');
var router = express.Router();

var companyController = require('../controllers/companies');

router.get('/', companyController.index);

router.get('/create/:id/:town', companyController.createCompany);

module.exports = router;
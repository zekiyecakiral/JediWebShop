const express = require('express');


const calculateControllers = require('../controllers/calculate-controllers');

const router = express.Router();



// router.get('/', calculateControllers.calculate);

// router.use(checkAuth);

router.post(
  '/parse',
  calculateControllers.XMLParser
);

router.post(
    '/',
    calculateControllers.calculate
  );
  


module.exports = router;
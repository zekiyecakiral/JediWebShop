const express = require('express');
const crystalsControllers = require('../controllers/crystals-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', crystalsControllers.getAllCrystals);

router.use(checkAuth);

router.post(
  '/',
  crystalsControllers.createCrystal
);



module.exports = router;

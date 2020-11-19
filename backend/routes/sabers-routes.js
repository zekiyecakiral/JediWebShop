const express = require('express');
const sabersControllers = require('../controllers/sabers-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/allSabers', sabersControllers.getAllSabers);

router.get('/:id', sabersControllers.getSaberById);


router.post(
  '/createItem',
  fileUpload.single('image'),
  sabersControllers.createSaber
);

router.post('/', sabersControllers.createXmlSabers);

router.patch('/:id',
fileUpload.single('image'),
sabersControllers.updateSaber);

router.delete('/:id', sabersControllers.deleteSaber);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.patch(
  '/:uid',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty()
  ],
  usersController.updateUser
);


router.post('/login', usersController.login);


module.exports = router;

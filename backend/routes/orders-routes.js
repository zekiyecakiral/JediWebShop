const express = require('express');
const ordersControllers = require('../controllers/orders-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', ordersControllers.getAllOrders);

router.get('/:uid', ordersControllers.getOrdersByUserId);

router.use(checkAuth);

router.post(
  '/:id',
  ordersControllers.createOrder
);



module.exports = router;
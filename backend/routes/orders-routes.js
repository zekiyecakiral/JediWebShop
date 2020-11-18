const express = require('express');
const ordersControllers = require('../controllers/orders-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.use(checkAuth);

router.get('/', ordersControllers.getAllOrders);

router.get('/', ordersControllers.getOrdersByUserId);

router.post(
  '/:id',
  ordersControllers.createOrder
);



module.exports = router;
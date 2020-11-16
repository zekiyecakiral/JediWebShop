const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Order = require('../models/order');

const createOrder = async (req, res, next) => {
  const saberId = req.params.id;
  const { price } = req.body;

  const createdOrder = new Order({
    userId: req.userData.userId,
    saberId,
    price,
    createdAt: Date.now(),
  });

  let result;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    result = await createdOrder.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating order failed, please try again.',
      500
    );
    return next(error);
  }

  result.populate('saberId', function (err) {
    res.status(201).json({
      message: 'order successfull',
      lightsabername: result.saberId.name,
    });
  });
};

const getOrdersByUserId = async (req, res, next) => {
  console.log('get order by id');
  const userId = req.params.uid;
  console.log('userId', userId);


  try {
    await Order.find({ userId: userId }).lean()
    .populate({ path: 'saberId userId' })
    .exec(function(err, docs) {
  
      var options = {
        path: 'saberId.crystal',
        model: 'Crystal'
      };
  
      if (err) return res.json(500);
      Order.populate(docs, options, function (err, projects) {

        console.log('proo',projects);
         res.json({ orders: projects });
      });
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find an order.',
      500
    );
    return next(error);
  }


};

const getAllOrders = async (req, res, next) => {
  try {
    await Order.find({})
    .lean()
    .populate({ path: 'saberId userId' })
    .exec(function(err, docs) {
  
      var options = {
        path: 'saberId.crystal',
        model: 'Crystal'
      };
  
      if (err) return res.json(500);
      Order.populate(docs, options, function (err, projects) {

        console.log('proo',projects);
         res.json({ orders: projects });
      });
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find orders.',
      500
    );
    return next(error);
  }

//   console.log('all orders', orders);

//   if (!orders) {
//     const error = new HttpError('Could not find orders', 404);
//     return next(error);
//   }

//   res.json({ orders: orders });
};

exports.createOrder = createOrder;
exports.getOrdersByUserId = getOrdersByUserId;
exports.getAllOrders = getAllOrders;

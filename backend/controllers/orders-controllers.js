const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Order = require('../models/order');
const Saber = require('../models/saber');
const User = require('../models/user');

const calculateSaber = require('../util/calculateSaber');

const createOrder = async (req, res, next) => {

  const saberId = req.params.id;

  let saber;
  try {
    saber = await Saber.findOne({ saberId: saberId }).populate('crystal');
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not find sabers.',
      500
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not find user saber.',
      500
    );
    return next(error);
  }

  //Calculate price for this order
  const calculateSaberResult = calculateSaber(user.age, saber.crystal);
  const price = calculateSaberResult.price;


  const createdOrder = new Order({
    userId: req.userData.userId,
    saberId:saber.id,
    price:price,
    createdAt: Date.now(),
  });

  let result;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    result = await createdOrder.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Creating order failed, please try again.',
      500
    );
    return next(error);
  }

  //after buy this order, reduce available!

  saber.available = saber.available - 1;
  if (saber.available < 0) {
    const error = new HttpError(
      'You can not order this saber, out of stock!',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await saber.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      'Updating saber available failed, please try again.',
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
  const userId = req.userData.userId;
  console.log('userId', userId);

  try {
    await Order.find({ userId: userId })
      .lean()
      .populate({ path: 'saberId userId' })
      .exec(function (err, docs) {
        var options = {
          path: 'saberId.crystal',
          model: 'Crystal',
        };

        if (err) return res.json(500);

        Order.populate(docs, options, function (err, projects) {
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
      .exec(function (err, docs) {
        var options = {
          path: 'saberId.crystal',
          model: 'Crystal',
        };

        if (err) return res.json(500);
        Order.populate(docs, options, function (err, projects) {
          console.log('proo', projects);
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
};

exports.createOrder = createOrder;
exports.getOrdersByUserId = getOrdersByUserId;
exports.getAllOrders = getAllOrders;

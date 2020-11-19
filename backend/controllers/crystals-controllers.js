const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Crystal = require('../models/crystal');

const createCrystal = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, color, planet, forcePercentage, harvestedAmount } = req.body;

  let crystal;
  try {
    crystal = await Crystal.findOne({ color: color });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete notification in comment, maybe comment not exist.',
      500
    );
    return next(error);
  }
  if (crystal) {
    const error = new HttpError(
      'The crystal color exists, please create new one!',
      404
    );
    return next(error);
  }

  const createdCrystal = new Crystal({
    color,
    name,
    planet,
    forcePercentage,
    harvestedAmount,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCrystal.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating crystal failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ crystal: createdCrystal });
};

const getAllCrystals = async (req, res, next) => {
  let crystals;
  try {
    crystals = await Crystal.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find crystals.',
      500
    );
    return next(error);
  }

  res.status(200).json({
    crystals: crystals.map((crystal) => crystal.toObject({ getters: true })),
  });
};

exports.createCrystal = createCrystal;
exports.getAllCrystals = getAllCrystals;

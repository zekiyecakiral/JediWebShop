const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Saber = require('../models/saber');
const Crystal = require('../models/crystal');
const User = require('../models/user');

const calculateSaber = require('../util/calculateSaber');


const getSaberById = async (req, res, next) => {

  const saberId = req.params.id;

  console.log('get saber by id', saberId);

  let saber;
  try {
    saber = await Saber.findById(saberId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a saber.',
      500
    );
    return next(error);
  }

  console.log(saber);

  if (!saber) {
    const error = new HttpError(
      'Could not find product for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ saber: saber.toObject({ getters: true }) });
};

const getAllSabers = async (req, res, next) => {
  console.log('getl all products');

  const userId = req.params.uid;
  console.log('userId',userId);

  let sabers;
  try {
    sabers = await Saber.find({}).populate('crystal').lean();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find sabers.',
      500
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not find user saber.',
      500
    );
    return next(error);
  }

  console.log('user',user);


  // console.log('all sabers', sabers);

  // for(let i = 0 ; i<sabers.length; i++){

  //  const price = await getCalculatedPrice(user.age,sabers[i].crystal.harvestedAmount,sabers[i].crystal.forcePercentage)

  //  console.log('price',price);

  // }
  const sabersWithPrice = sabers.map((saber) => {

    const calculateSaberResult = calculateSaber(user.age,saber.crystal)
  
    const newPropsObj = {
      price:calculateSaberResult.price
    };
    return Object.assign(saber, newPropsObj);
  });

  console.log('sabersWithPrice',sabersWithPrice);

  res.json({
    sabers:sabersWithPrice});
};

const createSaber = async (req, res, next) => {
  console.log('created saber');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { id, name, available, crystalId } = req.body;

  let crystal;
  try {
    crystal = await Crystal.findById(crystalId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,couldn't find crystal color.",
      500
    );
    return next(error);
  }
  console.log('crystal', crystal);
  if (!crystal) {
    const error = new HttpError("The crystal color couldn't found!", 404);
    return next(error);
  }

  const createdSaber = new Saber({
    saberId: id,
    name,
    available,
    image: req.file.path,
    crystal: crystal._id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdSaber.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      'Creating saber failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ saber: createdSaber });
};

const deleteSaber = async (req, res, next) => {
  const saberId = req.params.id;

  let saber;
  try {
    saber = await Saber.findById(saberId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete saber.',
      500
    );
    return next(error);
  }

  if (!saber) {
    const error = new HttpError('Could not find saber for this id.', 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await saber.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete saber.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted saber.' });
};

const updateSaber = async (req, res, next) => {
  console.log('update saberrrr');

  const { id, name, available, crystalId } = req.body;

  console.log('name', name);

  const saberId = req.params.id;

  let saber;
  try {
    saber = await Saber.findById(saberId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update saber.',
      500
    );
    return next(error);
  }

  saber.saberId = id;
  saber.name = name;
  saber.available = available;
  saber.crystalId = crystalId;
  saber.image = req.file.path;

  try {
    await saber.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update saber.',
      500
    );
    return next(error);
  }

  res.status(200).json({ saber: saber.toObject({ getters: true }) });
};

exports.createSaber = createSaber;
exports.getAllSabers = getAllSabers;
exports.getSaberById = getSaberById;
exports.deleteSaber = deleteSaber;
exports.updateSaber = updateSaber;

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Saber = require('../models/saber');
const Crystal = require('../models/crystal');
const User = require('../models/user');

const calculateSaber = require('../util/calculateSaber');

const getSaberById = async (req, res, next) => {
  const saberId = req.params.id;
  let saber;
  try {
    saber = await Saber.findOne({ saberId: saberId }).populate(
      'crystal',
      'name color planet'
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a saber.',
      500
    );
    return next(error);
  }

  if (!saber) {
    const error = new HttpError(
      'Could not find saber for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ saber: saber.toObject({ getters: true }) });
};

const getAllSabers = async (req, res, next) => {
  const userId = req.userData.userId;
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

  if (!user.isAdmin) {
    const sabersWithPrice = sabers.map((saber) => {
      const calculateSaberResult = calculateSaber(user.age, saber.crystal);
      const newPropsObj = {
        price: calculateSaberResult.price,
        force:calculateSaberResult.force,
        degree: calculateSaberResult.degree,

      };
      return Object.assign(saber, newPropsObj);
    });

    res.json({
      sabers: sabersWithPrice,
    });
  } else {
    res.json({
      sabers: sabers,
    });
  }
};

const createSaber = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { id, name, available, crystalId } = req.body;


  let saberExisted;
  try {
    saberExisted = await Saber.findOne({ saberId: id });
  } catch (err) {
    errors.push(
      'SaberId ' +
        saber.id +
        ' => Something went wrong, could not find a saber.'
    );;
  }

  if(saberExisted){
    const error = new HttpError(
      "This saber already exists in our system!",
      500
    );
    return next(error);
  }


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
  if (!crystal) {
    const error = new HttpError("The crystal color couldn't found!", 404);
    return next(error);
  }
  let image='';
  if(req.file){
    image=req.file.path;
  }

  const createdSaber = new Saber({
    saberId: id,
    name,
    available,
    image:image ,
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

  res.status(205).json({ saber: createdSaber });
};

const createXmlSabers = async (req, res, next) => {

  const { sabers } = req.body;

  console.log('saberss',sabers);
  
  let errors = [];
  try {
    if (!sabers) {
      console.log('hey burda');
      errors.push('Invalid data!');
    }else {

      console.log('saber',sabers.length);

      for (let i = 0; i < sabers.saber.length; i++) {

        let saber = sabers.saber[i];
        console.log('saber',saber);
        let crystal;
  
        if (!saber.id && saber.id > 0) {
          errors.push('SaberId ' + saber.id + ' is not valid!');
          continue;
        } else if (!saber.name) {
          errors.push('SaberId ' + saber.id + ' has not name!');
          continue;
        } else if (!saber.available) {
          errors.push('SaberId ' + saber.id + ' => available is not valid!');
          continue;
        } else if (!saber.crystal.color) {
          errors.push('SaberId ' + saber.id + ' has not color!');
          continue;
        } else if (!saber.crystal.name) {
          errors.push('SaberId ' + saber.id + ' has not name!');
          continue;
        }
        try {
          crystal = await Crystal.findOne({
            color: { $regex: saber.crystal.color, $options: 'i' }
          });
        } catch (err) {
          errors.push(
            'SaberId ' +
              saber.id +
              ' => Something went wrong, could not find crystals.'
          );
          continue;
        }
  
        if (!crystal) {
          let defaults = {};
          defaults['red'] = {
            color: 'Red',
            planet: 'Ilum',
            forcePercentage: 20,
            harvestedAmount: 101,
          };
          defaults['blue'] = {
            color: 'Blue',
            planet: 'Dantooine',
            forcePercentage: 19,
            harvestedAmount: 10,
          };
          defaults['green'] = {
            color: 'Green',
            planet: 'Dagobah',
            forcePercentage: 22,
            harvestedAmount: 37,
          };
  
          if (defaults[saber.crystal.color.toLowerCase()]) {
            crystalDefault = defaults[saber.crystal.color.toLowerCase()];
  
            newCrystal = new Crystal({
              color: crystalDefault.color,
              name: saber.crystal.name,
              planet: crystalDefault.planet,
              forcePercentage: crystalDefault.forcePercentage,
              harvestedAmount: crystalDefault.harvestedAmount,
            });
  
            try {
              const sess = await mongoose.startSession();
              sess.startTransaction();
              await newCrystal.save({ session: sess });
              await sess.commitTransaction();
            } catch (err) {
              console.log(crystalDefault);
              console.log(saber.crystal.name);
              console.log(err);
              errors.push(
                'crystal color ' +
                  saber.crystal.color +
                  ' => Creating crystal color failed!'
              );
              continue;
            }
  
            crystal = newCrystal;
          }
  
          try {
            crystal = await Crystal.findOne({
              color: { $regex: saber.crystal.color, $options: 'i' },
            });
          } catch (err) {
            errors.push(
              'SaberId ' +
                saber.id +
                ' => Something went wrong, could not find crystals.'
            );
            continue;
          }
        }
  
        if (!crystal) {
          errors.push('SaberId ' + saber.id + ' => Please create new crystal!');
          continue;
        }
  
        let saberExisted;
        try {
          saberExisted = await Saber.findOne({ saberId: saber.id });
        } catch (err) {
          errors.push(
            'SaberId ' +
              saber.id +
              ' => Something went wrong, could not find a saber.'
          );
          continue;
        }
  
        if (saberExisted) {
          console.log(saberExisted);
          errors.push(
            'SaberId ' + saber.id + ' => is already created in our system!'
          );
          continue;
        }
  
        const newSaber = new Saber({
          saberId: saber.id,
          name: saber.name,
          available: saber.available,
          crystal: crystal._id,
        });
  
        try {
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await newSaber.save({ session: sess });
          await sess.commitTransaction();
        } catch (err) {
          errors.push(
            'SaberId ' +
              saber.id +
              ' => Creating saber failed! Reason: ' +
              err.message
          );
          continue;
        }
      }
    }
  } catch (error) {}

  if (errors && errors.length > 0) {
    const error = new HttpError(errors.join(', \n '), 404);
    return next(error);
  } else res.status(205).json({ message: 'saved all sabers.' });


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
  const saberId = req.params.id;

  const { name, available } = req.body;
  let saber;
  try {
    saber = await Saber.findOne({ saberId: saberId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update saber.',
      500
    );
    return next(error);
  }

  saber.name = name;
  saber.available = available;
  if (req.file) {
    saber.image = req.file.path;
  }

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

exports.createXmlSabers = createXmlSabers;
exports.createSaber = createSaber;
exports.getAllSabers = getAllSabers;
exports.getSaberById = getSaberById;
exports.deleteSaber = deleteSaber;
exports.updateSaber = updateSaber;

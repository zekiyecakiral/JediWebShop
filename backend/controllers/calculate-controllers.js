const HttpError = require('../models/http-error');
const xml2js = require('xml2js');
const Crystal = require('../models/crystal');

const calculateSaber = require('../util/calculateSaber');

const XMLParser = async (req, res, next) => {
  if (!req.files) {
    return res.status(500).send({ msg: 'file is not found' });
  }
  const myFile = req.files.file;

  var parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(myFile.data, (err, result) => {
    if (err) {
      res.status(400).send({ error: 'File could not be parsed' });
    }

    if (!result.sabers || !result.sabers.saber) {
      res.status(400).send({ error: 'Invalid XML data!!' });
    }
    result.sabers.saber.forEach((saber) => {
      if (
        !saber.id ||
        !saber.name ||
        !saber.available ||
        !saber.crystal ||
        !saber.crystal.name ||
        !saber.crystal.color
      ) {
        res.status(400).send({ error: 'Invalid XML data!!' });
      }
    });

    res.status(201).send({ result: result });
  });
};

const calculate = async (req, res, next) => {
  const { age, color, crystalName } = req.body;

  let crystal;
  try {
    crystal = await Crystal.findOne({
      color: { $regex: color, $options: 'i' },
      name: { $regex: crystalName, $options: 'i' },
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find crystals.',
      500
    );
    return next(error);
  }

  const calculatedResults = calculateSaber(age, crystal);

  res.status(200).send({ result: calculatedResults });
};

exports.XMLParser = XMLParser;
exports.calculate = calculate;

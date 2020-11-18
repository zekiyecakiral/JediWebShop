const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const sabersRoutes = require('./routes/sabers-routes');
const crystalsRoutes = require('./routes/crystals-routes');
const ordersRoutes = require('./routes/orders-routes');
const calculateRoutes = require('./routes/calculate-routes');

const fileUpload = require('express-fileupload');

const HttpError = require('./models/http-error');

const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/Jedisabershop/users', usersRoutes);


app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/Jedisabershop/saber', sabersRoutes);

app.use('/Jedisabershop/crystal', crystalsRoutes);

app.use('/Jedisabershop/order/saber', ordersRoutes);


app.use(fileUpload());
app.use('/Jedisabershop/calculate', calculateRoutes);



app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// 122- connecting to database

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hyf.463mg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database is connected!')
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server is running!')
    });
  }
  )
  .catch(err => {
    console.log(err);
  }
  );
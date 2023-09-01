const express = require('express');
const mongoose = require('mongoose');

const {
  HTTP_STATUS_NOT_FOUND,
} = require('./errors/httpStatusCodes');

const app = express();

const router = require('./routes');

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '64edf9df05c1d3d3bcfad591',
  };
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
});

app.use(express.json());
app.use(router);

app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Page not found' });
});

app.listen(PORT, () => {
});

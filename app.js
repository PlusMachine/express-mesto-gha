const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
});

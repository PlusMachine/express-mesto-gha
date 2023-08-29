const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');

const port = 3000;

app.use((req, res, next) => {
  req.user = {
    _id: '64edf9df05c1d3d3bcfad591',
  };
  console.log(req);
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

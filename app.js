const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const errorHandler = require('./middlewares/error-handler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(helmet());

const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
});

app.use(express.json());
app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
});

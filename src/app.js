const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('*', (req, res, next) => {
  // check authorization header
  if (process.env.NODE_ENV === 'production' && !req.headers.authorization) {
    res.status(401).json({
      error: 'Unauthorized request',
    });
  } else next();
});

app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

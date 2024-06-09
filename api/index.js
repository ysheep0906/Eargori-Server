const dotenv = require('dotenv')
const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const mongoose = require('mongoose');
const connectDB = require('../config/dbConnect');

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/users', require('../routes/userRoute'));

app.use('/sentences', require('../routes/sentenceRoute'));

app.use('/places', require('../routes/placeRoute'));

app.use('/articles', require('../routes/articleRoute'));

mongoose.connection.once('open', () => {
  app.listen(process.env.PORT || port, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

mongoose.connection.on('error', err => {
  console.log(err);
});

module.exports = app;
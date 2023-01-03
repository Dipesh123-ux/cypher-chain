const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors')

const memberRoutes = require('./routes/member')

const app = express();

app.use(cors())

app.use(bodyParser.json());

app.use('/api',memberRoutes);

const port = process.env.PORT || 8080;


mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.DATABASE,{ useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => console.log(err));

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ exposedHeaders: 'auth-token' }));
app.use(express.json({ limit: '50mb', extended: true }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully')
})

const usersRouter = require('./routes/users')
const activitiesRouter = require('./routes/activities')
const funfactsRouter = require('./routes/funfacts')
const ecocategoriesRouter = require('./routes/ecocategories')

app.use('/api/users', usersRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/funfacts', funfactsRouter)
app.use('/api/ecocategories', ecocategoriesRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})

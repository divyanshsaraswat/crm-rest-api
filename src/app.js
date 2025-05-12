const express = require('express');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainfuncRoutes');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/users', userRoutes);
app.use('/api/mainfunc', mainRoutes);



app.get('/', (req, res) => {
  res.send('Welcome to the CRM API!');
});
module.exports = app;
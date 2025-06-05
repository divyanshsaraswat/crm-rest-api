const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const accountRoutes = require('./routes/accountRoutes');
const taskRoutes = require('./routes/tasksRoutes');
const leadRoutes = require('./routes/leadRoutes');
const oppRoutes = require('./routes/opportunitiesRoutes');
const campRoutes = require('./routes/campaignRoutes');
const mainRoutes = require('./routes/mainfuncRoutes');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['https://crm-first.vercel.app'], // 🚫 No trailing slash
  credentials: true,
}));

app.options('*', cors()); // ✅ Handle preflight

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/opps',oppRoutes);
app.use('/api/campaigns',campRoutes);
app.use('/api/mainfunc', mainRoutes);



app.get('/', (req, res) => {
  res.send('Welcome to the CRM API!');
});
module.exports = app;
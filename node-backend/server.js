require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
app.use('/names', require('./routes/api/names'));
app.use('/teams', require('./routes/api/teams'))

const rivers = [
    'Nile',
    'Yangtze',
    'Mississippi',
    'Danube',
    'Ganges',
    'Murray',
    'Volga',
    'Rhine',
    'Congo',
    'Indus',
    'Mekong',
    'Colorado',
    'Yukon',
    'Thames',
    'Paraná',
    'Niger',
    'Darling',
    'Tigris',
    'Euphrates'
]

app.get('/rivers', (req, res) => {
  res.json(rivers);
})

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
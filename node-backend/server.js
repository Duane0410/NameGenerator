const express = require('express')
const app = express()
const cors = require('cors')
const port = 3500

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

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

app.use(verifyJWT);
app.use('/names', require('./routes/api/names'));
app.use('/teams', require('./routes/api/teams'))

const rivers = [
    'Amazon',
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
 
app.get('/celestial-bodies', (req, res) => {
  res.json(celestial_bodies);
})

app.get('/rivers', (req, res) => {
    res.json(rivers);
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
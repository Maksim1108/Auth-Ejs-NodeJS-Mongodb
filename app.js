const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const { log } = require('console');

const app = express();

const dbURI = `mongodb+srv://Maksim:Ebaloff1337228@auth.owkca.mongodb.net/auth?retryWrites=true&w=majority`;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3001))
  .catch((err) => console.log(err));

const block = [
  {
    img: '/images/premium/Offline.svg',
    name: 'Offline mode.',
    description: 'Save and listen anywhere.',
  },
  {
    img: '/images/premium/HQ.svg',
    name: 'High quality audio.',
    description: 'Enjoy the full range of sound.',
  },
  { img: '/images/premium/NoADS.svg', name: 'No ads.', description: 'Enjoy nonstop music.' },
  {
    img: '/images/premium/UnlimSkips.svg',
    name: 'Unlimited skips.',
    description: 'Just tap skip.',
  },
];

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
}).single('myPhoto')

app.get('*', checkUser)

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.render('oopss', {message: err})
    } else {
      const filename = req.file.filename
      res.render('settings', {filename})
    }
  })
})

app.get('/', (req, res) => {
  res.render('pages/index', { block });
});

app.get('/moods', requireAuth, (req, res) => {
  res.render('pages/moods');
});

app.get('/home', (req, res) => {
  res.render('pages/home');
});
app.use(authRouter); 

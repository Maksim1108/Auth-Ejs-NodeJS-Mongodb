const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  let errors = { email: '', password: '', username: '' };

  if (err.keyValue.username) {
    errors.username = 'Такой пользователь уже был создан';
    return errors;
  }
  if (err.keyValue.email) {
    errors.email = 'Эта почта уже занята';
    return errors;
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'aiza-ayday-zhamal', {
    expiresIn: maxAge,
  });
};

const logIn_get = (req, res) => {
  res.render('pages/logIn');
};

const signUp_get = (req, res) => {
  res.render('pages/signup');
};

const logIn_post = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  try {
    const user = await User.login(email, password);
    res.status(200).json({ user: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const signUp_post = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = createToken(user._id);
    res.cookie('ayday', token, { httpOnly: true });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = { logIn_get, signUp_get, logIn_post, signUp_post };

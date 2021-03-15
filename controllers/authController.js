const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  console.log(err.message);
  let errors = { email: '', password: '', username: '' };

  if (err.message === 'Такого аккаунта не существует') {
    errors.email = 'Эта почта еще не была зарегистрирована в системе';
  }

  if (err.message === 'Пароль неправильный') {
    errors.password = 'Пароль который вы вели является не валидным';
  }

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
  return jwt.sign({ id }, 'ayday', {
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

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ err });
  }
};

const signUp_post = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logOut_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1});
  res.redirect('/')
}

module.exports = { logIn_get, signUp_get, logIn_post, signUp_post, logOut_get };

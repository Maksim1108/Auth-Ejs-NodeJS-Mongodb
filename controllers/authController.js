const User = require("../models/User");

const logIn_get = (req, res) => {
  res.render("pages/logIn");
};

const signUp_get = (req, res) => {
  res.render("pages/signup");
};

const logIn_post = (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username, password);
    res.send("Это страница Логина POST");
  } catch (err) {
      console.log(err);
  }
};

const signUp_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({username, password})
    res.send("Это страница Регистрации POST");
  } catch (err) {
      console.log(err);
  }
};

module.exports = { logIn_get, signUp_get, logIn_post, signUp_post };

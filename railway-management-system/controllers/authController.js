// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY;

const signup = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  createUser(username, hashedPassword, email, 'user', (err, userId) => {
    if (err) return res.status(500).send("Error registering user.");
    res.status(200).send({ status: "Account successfully created", status_code: 200, user_id: userId });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  getUserByUsername(username, (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).send({ status: "Login successful", status_code: 200, user_id: user.id, access_token: token });
  });
};

module.exports = { signup, login };

// models/user.js
const db = require('../database');

const createUser = (username, password, email, role, callback) => {
  db.run(`INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
    [username, password, email, role],
    function(err) {
      callback(err, this.lastID);
    });
};

const getUserByUsername = (username, callback) => {
  db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
};

module.exports = { createUser, getUserByUsername };

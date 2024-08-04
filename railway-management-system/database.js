// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_name TEXT,
    source TEXT,
    destination TEXT,
    seat_capacity INTEGER,
    available_seats INTEGER,
    arrival_time_at_source TEXT,
    arrival_time_at_destination TEXT
  )`);

  db.run(`CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    train_id INTEGER,
    no_of_seats INTEGER,
    seat_numbers TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(train_id) REFERENCES trains(id)
  )`);
});

module.exports = db;

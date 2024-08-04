// models/train.js
const db = require('../database');

const createTrain = (train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination, callback) => {
  db.run(`INSERT INTO trains (train_name, source, destination, seat_capacity, available_seats, arrival_time_at_source, arrival_time_at_destination) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [train_name, source, destination, seat_capacity, seat_capacity, arrival_time_at_source, arrival_time_at_destination],
    function(err) {
      callback(err, this.lastID);
    });
};

const getTrainsByRoute = (source, destination, callback) => {
  db.all(`SELECT * FROM trains WHERE source = ? AND destination = ?`, [source, destination], callback);
};

const getTrainById = (id, callback) => {
  db.get(`SELECT * FROM trains WHERE id = ?`, [id], callback);
};

const updateAvailableSeats = (id, available_seats, callback) => {
  db.run(`UPDATE trains SET available_seats = ? WHERE id = ?`, [available_seats, id], callback);
};

module.exports = { createTrain, getTrainsByRoute, getTrainById, updateAvailableSeats };

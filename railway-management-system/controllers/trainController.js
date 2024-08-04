// controllers/trainController.js
const { createTrain, getTrainsByRoute, getTrainById, updateAvailableSeats } = require('../models/train');

const addTrain = (req, res) => {
  const { train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination } = req.body;

  createTrain(train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination, (err, trainId) => {
    if (err) return res.status(500).send("Error adding train.");
    res.status(200).send({ message: "Train added successfully", train_id: trainId });
  });
};

const getAvailability = (req, res) => {
  const { source, destination } = req.query;

  getTrainsByRoute(source, destination, (err, rows) => {
    if (err) return res.status(500).send("Error fetching trains.");
    res.status(200).send(rows.map(row => ({ train_id: row.id, train_name: row.train_name, available_seats: row.available_seats })));
  });
};

module.exports = { addTrain, getAvailability };

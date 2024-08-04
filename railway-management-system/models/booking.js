// models/booking.js
const db = require('../database');

const createBooking = (user_id, train_id, no_of_seats, seat_numbers, callback) => {
  db.run(`INSERT INTO bookings (user_id, train_id, no_of_seats, seat_numbers) VALUES (?, ?, ?, ?)`,
    [user_id, train_id, no_of_seats, seat_numbers],
    function(err) {
      callback(err, this.lastID);
    });
};

const getBookingById = (id, callback) => {
  db.get(`SELECT * FROM bookings WHERE id = ?`, [id], callback);
};

module.exports = { createBooking, getBookingById };

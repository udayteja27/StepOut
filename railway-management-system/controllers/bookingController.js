// controllers/bookingController.js
const { getTrainById, updateAvailableSeats } = require('../models/train');
const { createBooking, getBookingById } = require('../models/booking');

const bookSeat = (req, res) => {
  const { train_id } = req.params;
  const { no_of_seats } = req.body;

  getTrainById(train_id, (err, train) => {
    if (err || !train || train.available_seats < no_of_seats) return res.status(400).send("Not enough seats available.");

    const new_available_seats = train.available_seats - no_of_seats;
    updateAvailableSeats(train_id, new_available_seats, (err) => {
      if (err) return res.status(500).send("Error booking seats.");

      const seat_numbers = Array.from({ length: no_of_seats }, (_, i) => i + (train.seat_capacity - train.available_seats));
      createBooking(req.user.id, train_id, no_of_seats, seat_numbers.join(','), (err, bookingId) => {
        if (err) return res.status(500).send("Error creating booking.");
        res.status(200).send({ message: "Seat booked successfully", booking_id: bookingId, seat_numbers });
      });
    });
  });
};

const getBookingDetails = (req, res) => {
  const { booking_id } = req.params;

  getBookingById(booking_id, (err, booking) => {
    if (err || !booking || booking.user_id !== req.user.id) return res.status(404).send("Booking not found.");

    getTrainById(booking.train_id, (err, train) => {
      if (err || !train) return res.status(404).send("Train not found.");
      res.status(200).send({ booking_id: booking.id, train_id: train.id, train_name: train.train_name, user_id: booking.user_id, no_of_seats: booking.no_of_seats, seat_numbers: booking.seat_numbers.split(','), arrival_time_at_source: train.arrival_time_at_source, arrival_time_at_destination: train.arrival_time_at_destination });
    });
  });
};

module.exports = { bookSeat, getBookingDetails };

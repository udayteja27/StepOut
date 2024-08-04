import React, { useState } from 'react';
import { bookSeat } from '../api';
import './Booking.css'

const Booking = ({ user }) => {
  const [trainId, setTrainId] = useState('');
  const [noOfSeats, setNoOfSeats] = useState(1);
  const [message, setMessage] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await bookSeat(trainId, { no_of_seats: noOfSeats }, user.access_token);
      setMessage('Seat booked successfully!');
    } catch (error) {
      setMessage('Error booking seat.');
      console.error('Error booking seat:', error);
    }
  };

  return (
    <div>
      <h2>Book a Seat</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleBooking}>
        <input
          type="text"
          value={trainId}
          onChange={(e) => setTrainId(e.target.value)}
          placeholder="Train ID"
          required
        />
        <input
          type="number"
          value={noOfSeats}
          onChange={(e) => setNoOfSeats(e.target.value)}
          min="1"
          max="10"
          required
        />
        <button type="submit">Book</button>
      </form>
    </div>
  );
};

export default Booking;

import React, { useState } from 'react';
import Auth from './components/Auth';
import Train from './components/Train';
import Booking from './components/Booking';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/trains">Trains</a>
        <a href="/bookings">Bookings</a>
        {user ? <button onClick={() => setUser(null)}>Logout</button> : <a href="/auth">Login</a>}
      </div>
      <div className="container">
        {!user ? <Auth setUser={setUser} /> : (
          <>
            <Train />
            <Booking />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

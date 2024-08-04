const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

let db;

(async () => {
  db = await open({
    filename: './railway_management.db',
    driver: sqlite3.Database,
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS trains (
      train_id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_name TEXT,
      source TEXT,
      destination TEXT,
      seat_capacity INTEGER,
      arrival_time_at_source TEXT,
      arrival_time_at_destination TEXT
    );
    CREATE TABLE IF NOT EXISTS bookings (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      train_id INTEGER,
      seat_numbers TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(train_id) REFERENCES trains(train_id)
    );
  `);
})();

// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const result = await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists or other error.' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
      res.json({ access_token: token, user: { id: user.id, username: user.username, email: user.email, role: 'user' } });
    } else {
      res.status(400).json({ error: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Add train (admin only)
app.post('/api/trains', async (req, res) => {
  try {
    const { train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination } = req.body;
    await db.run('INSERT INTO trains (train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination) VALUES (?, ?, ?, ?, ?, ?)', [train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination]);
    res.status(201).json({ message: 'Train added successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get all trains
app.get('/api/trains', async (req, res) => {
  try {
    const trains = await db.all('SELECT * FROM trains');
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Book seat
app.post('/api/bookings/:train_id', async (req, res) => {
  try {
    const { train_id } = req.params;
    const { no_of_seats } = req.body;
    const { id } = jwt.verify(req.headers.authorization.split(' ')[1], secretKey);
    const seatNumbers = Array.from({ length: no_of_seats }, (_, i) => i + 1).join(',');
    await db.run('INSERT INTO bookings (user_id, train_id, seat_numbers) VALUES (?, ?, ?)', [id, train_id, seatNumbers]);
    res.status(201).json({ message: 'Seat booked successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get booking details
app.get('/api/bookings/:booking_id', async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await db.get('SELECT * FROM bookings WHERE booking_id = ?', [booking_id]);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

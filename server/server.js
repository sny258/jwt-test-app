const express = require('express');
const sqlite3 = require('sqlite3').verbose();
// const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = 5000;
const jwtSecret =  process.env.JWT_SECRET;

// Middleware to parse cookies
app.use(cookieParser());
// Middleware to enable CORS
app.use(cors(
    {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
    }
  ));
// Add this middleware to parse JSON bodies, or body-parser package is also an option
app.use(express.json());
// app.use(bodyParser.json());

// SQLite database setup
const dbPath = path.resolve(__dirname, 'database.db');
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Connected to the SQLite database at ${dbPath}`);
});
//create DB tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT,
    lastname TEXT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT
  )`);
});


// Signup endpoints
app.post('/signup', (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  // Check if the user already exists
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ message: 'Username already exists 😬' });
    } else {
        // Hash the password before storing it in the database
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          // Insert the user into the database
          db.run(`INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`,   [firstname, lastname, username, email, hash], (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ message: 'User registered successfully ...' });
          });
        });
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // First, check if the username exists in the database
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, userExists) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!userExists) {
      // If username does not exist, ask the user to sign up
      return res.status(400).json({ message: 'Username does not exist. Please sign up 😬' });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, userExists.password, (err, result) => {
        if (result) {
          // If the password is correct, create a JWT token
          const token = jwt.sign({ username: userExists.username }, jwtSecret, { expiresIn: '1h' });
          res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });  // 1 hour
          return res.status(200).json({ message: 'User logged in successfully ...', token });
        } else {
          return res.status(400).json({ message: 'Invalid password 😬' });
        }
      });
    }
  });
});

// Authenticated endpoint, get don't have body so we can't send token in body...
app.get('/authenticated', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  // Extract the token part from the 'Bearer <token>' string
  const token = authHeader.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  // Verify the token
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    return res.status(200).json({ message: 'User authenticated', user: decodedToken });
  });
});

// Middleware to verify JWT, this can be used for API calls (not from the browser)
// const authenticateJWT = (req, res, next) => {
//   const token = req.cookies.token;
//   if (token) {
//     jwt.verify(token, jwtSecret, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Invalid token' });
//       }
//       req.user = user; // Attach user info to request object
//       next();
//     });
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// Logout endpoint
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'User logged out successfully' });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
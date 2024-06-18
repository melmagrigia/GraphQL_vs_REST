const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3008;

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3006', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Fetch a user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch a subaperitivo by ID
app.get('/subaperitivos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Subaperitivos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Subaperitivo not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch a post by ID
app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Post not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch all posts by a user ID
app.get('/posts/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Posts WHERE userId = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch all posts by a subaperitivo ID
app.get('/posts/subaperitivo/:subaperitivoId', async (req, res) => {
  const { subaperitivoId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Posts WHERE subaperitivoId = $1', [subaperitivoId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch a comment by ID
app.get('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Comments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Comment not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch all comments by a user ID
app.get('/comments/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Comments WHERE userId = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch all comments by a post ID
app.get('/comments/post/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Comments WHERE postId = $1', [postId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

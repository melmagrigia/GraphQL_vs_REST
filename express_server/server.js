const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// Endpoint to fetch post with comments
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post
    const postQuery = `
      SELECT p.title, p.voteCount, 
             u.userName AS postUserName, 
             s.name AS subaperitivoName 
      FROM Posts p
      JOIN Users u ON p.userId = u.id
      JOIN Subaperitivos s ON p.subaperitivoId = s.id
      WHERE p.id = $1
    `;
    const postResult = await pool.query(postQuery, [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = postResult.rows[0];

    // Fetch comments count
    const commentsCountQuery = `
      SELECT COUNT(*) AS count 
      FROM Comments 
      WHERE postId = $1
    `;
    const commentsCountResult = await pool.query(commentsCountQuery, [postId]);
    const commentsCount = commentsCountResult.rows[0].count;

    // Fetch comments
    const commentsQuery = `
      SELECT c.commentContent, c.voteCount, u.userName AS commentUserName 
      FROM Comments c
      JOIN Users u ON c.userId = u.id
      WHERE c.postId = $1
    `;
    const commentsResult = await pool.query(commentsQuery, [postId]);
    const comments = commentsResult.rows.map(row => ({
      commentContent: row.commentcontent,
      voteCount: row.votecount,
      user: {
        userName: row.commentusername,
      },
    }));

    // Construct the response
    const response = {
      title: post.title,
      user: {
        userName: post.postusername,
      },
      subaperitivo: {
        name: post.subaperitivoname,
      },
      voteCount: post.votecount,
      commentsAggregate: {
        count: commentsCount,
      },
      comments: comments,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

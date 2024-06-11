const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;

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

app.get('/', async (req, res) => {
  try {
    const subaperitivosQuery = `
      SELECT name, description
      FROM Subaperitivos
      LIMIT 50
    `;
    
    const usersQuery = `
      SELECT id, userName, bio
      FROM Users
      LIMIT 50
    `;

    const postsCountQuery = `
      SELECT userId, COUNT(*) AS count
      FROM Posts
      GROUP BY userId
    `;

    const commentsCountQuery = `
      SELECT userId, COUNT(*) AS count
      FROM Comments
      GROUP BY userId
    `;

    const [subaperitivosResult, usersResult, postsCountResult, commentsCountResult] = await Promise.all([
      pool.query(subaperitivosQuery),
      pool.query(usersQuery),
      pool.query(postsCountQuery),
      pool.query(commentsCountQuery),
    ]);

    const users = usersResult.rows.map(user => {
      const postsCount = postsCountResult.rows.find(post => post.userid === user.id);
      const commentsCount = commentsCountResult.rows.find(comment => comment.userid === user.id);

      return {
        userName: user.username,
        bio: user.bio,
        postsAggregate: {
          count: postsCount ? postsCount.count : 0,
        },
        commentsAggregate: {
          count: commentsCount ? commentsCount.count : 0,
        },
      };
    });

    const data = {
      subaperitivos: subaperitivosResult.rows,
      users: users,
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// New endpoint for fetching user data with posts and comments
app.get('/users/:id', async (req, res) => {
  const userName = req.params.id;

  try {
    // Fetch user data
    const userQuery = `
      SELECT u.userName, u.bio
      FROM Users u
      WHERE u.userName = $1
    `;
    const userResult = await pool.query(userQuery, [userName]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch user's posts with aggregate comment counts
    const postsQuery = `
      SELECT p.id, p.title, p.voteCount, 
             u.userName AS postUserName, 
             s.name AS subaperitivoName,
             (SELECT COUNT(*) FROM Comments c WHERE c.postId = p.id) AS commentsCount
      FROM Posts p
      JOIN Users u ON p.userId = u.id
      JOIN Subaperitivos s ON p.subaperitivoId = s.id
      WHERE p.userId = (SELECT id FROM Users WHERE userName = $1)
    `;
    const postsResult = await pool.query(postsQuery, [userName]);
    const posts = postsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      user: {
        userName: row.postusername,
      },
      subaperitivo: {
        name: row.subaperitivoname,
      },
      voteCount: row.votecount,
      commentsAggregate: {
        count: row.commentscount,
      },
    }));

    // Fetch user's comments with associated post data
    const commentsQuery = `
      SELECT c.id, c.commentContent, c.voteCount, 
             u.userName AS commentUserName,
             p.title AS postTitle, p.id AS postId
      FROM Comments c
      JOIN Users u ON c.userId = u.id
      JOIN Posts p ON c.postId = p.id
      WHERE c.userId = (SELECT id FROM Users WHERE userName = $1)
    `;
    const commentsResult = await pool.query(commentsQuery, [userName]);
    const comments = commentsResult.rows.map(row => ({
      id: row.id,
      commentContent: row.commentcontent,
      voteCount: row.votecount,
      user: {
        userName: row.commentusername,
      },
      post: {
        title: row.posttitle,
        id: row.postid,
      },
    }));

    // Fetch aggregate counts for user's posts and comments
    const postsAggregateQuery = `
      SELECT COUNT(*) AS count
      FROM Posts
      WHERE userId = (SELECT id FROM Users WHERE userName = $1)
    `;
    const postsAggregateResult = await pool.query(postsAggregateQuery, [userName]);
    const postsAggregate = postsAggregateResult.rows[0].count;

    const commentsAggregateQuery = `
      SELECT COUNT(*) AS count
      FROM Comments
      WHERE userId = (SELECT id FROM Users WHERE userName = $1)
    `;
    const commentsAggregateResult = await pool.query(commentsAggregateQuery, [userName]);
    const commentsAggregate = commentsAggregateResult.rows[0].count;

    // Construct the response
    const response = {
      userName: user.username,
      bio: user.bio,
      posts: posts,
      postsAggregate: {
        count: postsAggregate,
      },
      comments: comments,
      commentsAggregate: {
        count: commentsAggregate,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint for fetching subaperitivo with posts
app.get('/subaperitivos/:id', async (req, res) => {
  const subaperitivoName = req.params.id;

  try {
    // Fetch subaperitivo data
    const subaperitivoQuery = `
      SELECT s.name, s.description
      FROM Subaperitivos s
      WHERE s.name = $1
    `;
    const subaperitivoResult = await pool.query(subaperitivoQuery, [subaperitivoName]);
    if (subaperitivoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subaperitivo not found' });
    }

    const subaperitivo = subaperitivoResult.rows[0];

    // Fetch posts for the subaperitivo with aggregate comment counts
    const postsQuery = `
      SELECT p.id, p.title, p.voteCount, 
             u.userName AS postUserName,
             (SELECT COUNT(*) FROM Comments c WHERE c.postId = p.id) AS commentsCount
      FROM Posts p
      JOIN Users u ON p.userId = u.id
      WHERE p.subaperitivoId = (SELECT id FROM Subaperitivos WHERE name = $1)
    `;
    const postsResult = await pool.query(postsQuery, [subaperitivoName]);
    const posts = postsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      user: {
        userName: row.postusername,
      },
      voteCount: row.votecount,
      commentsAggregate: {
        count: row.commentscount,
      },
    }));

    // Construct the response
    const response = {
      name: subaperitivo.name,
      description: subaperitivo.description,
      posts: posts,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching subaperitivo data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

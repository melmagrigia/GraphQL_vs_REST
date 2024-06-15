const { faker } = require('@faker-js/faker');
const { Client } = require('pg');
const { generateUsername } = require("unique-username-generator");

// Configure PostgreSQL client
const client = new Client({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

async function seedDatabase() {
  try {
    await client.connect();

    // Number of records to generate
    const numUsers = 10000;
    const numSubaperitivos = 5000;
    const numPosts = 20000;
    const numComments = 50000;

    // Generate unique Users
    const users = new Set();
    const userIds = [];
    while (users.size < numUsers) {
      const userName = generateUsername();
      if (!users.has(userName)) {
        const bio = faker.lorem.paragraph();
        const res = await client.query('INSERT INTO Users (userName, bio) VALUES ($1, $2) RETURNING id', [userName, bio]);
        userIds.push(res.rows[0].id);
        users.add(userName);
      }
    }

    // Generate unique Subaperitivos
    const subaperitivos = new Set();
    const subaperitivoIds = [];
    while (subaperitivos.size < numSubaperitivos) {
      const name = generateUsername();;
      if (!subaperitivos.has(name)) {
        const description = faker.lorem.paragraph();
        const res = await client.query('INSERT INTO Subaperitivos (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
        subaperitivoIds.push(res.rows[0].id);
        subaperitivos.add(name);
      }
    }

    // Generate Posts
    const posts = [];
    for (let i = 0; i < numPosts; i++) {
      const title = faker.lorem.sentence();
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const subaperitivoId = subaperitivoIds[Math.floor(Math.random() * subaperitivoIds.length)];
      const voteCount = faker.datatype.number({ min: 0, max: 100 });
      const res = await client.query('INSERT INTO Posts (title, userId, subaperitivoId, voteCount) VALUES ($1, $2, $3, $4) RETURNING id', [title, userId, subaperitivoId, voteCount]);
      posts.push(res.rows[0].id);
    }

    // Generate Comments
    for (let i = 0; i < numComments; i++) {
      const commentContent = faker.lorem.paragraph();
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const postId = posts[Math.floor(Math.random() * posts.length)];
      const voteCount = faker.datatype.number({ min: 0, max: 100 });
      await client.query('INSERT INTO Comments (commentContent, userId, postId, voteCount) VALUES ($1, $2, $3, $4)', [commentContent, userId, postId, voteCount]);
    }

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seedDatabase();

const { faker } = require('@faker-js/faker');
const { Client } = require('pg');

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
    const numUsers = 10;
    const numSubaperitivos = 5;
    const numPosts = 20;
    const numComments = 50;

    // Generate Users
    const users = [];
    for (let i = 0; i < numUsers; i++) {
      const userName = faker.internet.userName();
      const bio = faker.lorem.paragraph();
      const res = await client.query('INSERT INTO Users (userName, bio) VALUES ($1, $2) RETURNING id', [userName, bio]);
      users.push(res.rows[0].id);
    }

    // Generate Subaperitivos
    const subaperitivos = [];
    for (let i = 0; i < numSubaperitivos; i++) {
      const name = faker.lorem.word();
      const description = faker.lorem.paragraph();
      const res = await client.query('INSERT INTO Subaperitivos (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
      subaperitivos.push(res.rows[0].id);
    }

    // Generate Posts
    const posts = [];
    for (let i = 0; i < numPosts; i++) {
      const title = faker.lorem.sentence();
      const userId = users[Math.floor(Math.random() * users.length)];
      const subaperitivoId = subaperitivos[Math.floor(Math.random() * subaperitivos.length)];
      const voteCount = faker.datatype.number({ min: 0, max: 100 });
      const res = await client.query('INSERT INTO Posts (title, userId, subaperitivoId, voteCount) VALUES ($1, $2, $3, $4) RETURNING id', [title, userId, subaperitivoId, voteCount]);
      posts.push(res.rows[0].id);
    }

    // Generate Comments
    for (let i = 0; i < numComments; i++) {
      const commentContent = faker.lorem.paragraph();
      const userId = users[Math.floor(Math.random() * users.length)];
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

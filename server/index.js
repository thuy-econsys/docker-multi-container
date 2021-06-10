const keys = require('./keys');

// Express setup
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  host: keys.pgHost,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis client setup
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
// a duplicate publishing/listening client needs to be established separate from other redisClient actions
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.send('aaaaaaaahhh!');
});
// from PostgreSQL, get all values from the stored indices
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});
// from Redis, get all indices and their corresponding calculated values, retrieved from backend, as a hash
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});
// receive new values from React client, to be inserted into PostgreSQL permanent memory
app.post('/values', async (req, res) => {
  const index = req.body.index;

  // cap Fibonacci sequence max
  if (parseInt(index) > 40) {
    return res.status(422).send('Index overflow');
  }

  redisClient.hset('values', index, "Nothing yet!");
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listening');
});
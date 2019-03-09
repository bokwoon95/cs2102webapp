const app = require('express')();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config()


// Postgres
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// GET testdb : Test database connection
app.get('/testdb', (req, res) => {
  pool.query('SELECT NOW()', (qerr, qres) => {
    if (qerr) {
      res.json(qerr.stack);
    } else {
      qres.rows[0]["user"] = process.env.DB_USER;
      qres.rows[0]["host"] = process.env.DB_HOST;
      qres.rows[0]["database"] = process.env.DB_DATABASE;
      qres.rows[0]["password"] = process.env.DB_PASSWORD;
      qres.rows[0]["port"] = process.env.DB_PORT;
      qres.rows[0]["connection"] = "successful";
      res.json(qres.rows);
    }
  })
});

// Landing Page
app.get('/', (req, res) => res.send('<h1><i>Hello Shareleh!</i></h1>'));

/*
God function that handles all postgres queries
input can either be an SQL string -OR-
a json object of the following schema e.g
{
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}
*/
function poolquery(input, output) {
  pool.query(input, (qerr, qres) => {
    if (qerr) {
      output.json(qerr.stack);
    } else {
      output.json(qres.rows);
    }
  });
}

// GET table/:tname --> Show table
app.get('/table/:tname', (req, res) => {
  var query = 'SELECT * FROM ' + req.params['tname'];
  poolquery(query, res)
});

// POST query --> Process query (json) and return result (json)
app.post('/query', (req, res) => {
  poolquery(req.body, res);
});

/*
POST entry/insert --> Insert entry
input json schema = {
  "tbl":"users",
  "vals":"null, john"
}
*/
app.post('/entry/insert', (req, res) => {
  var query = {
    'text' : 'INSERT INTO ' + req.body['tbl'] + ' VALUES ($1)',
    'values' : [ req.body['vals']]
  }
  poolquery(query, res)
});

// POST entry/delete --> Delete entry
app.post('/entry/delete', (req, res) => {
  res.json(req.body);
});

// Starts the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('started website on localhost:' + port);
});

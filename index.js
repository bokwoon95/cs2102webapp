const express = require('express');
const app = express();
app.use(express.urlencoded());
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config()
const expressport = process.env.PORT || 4000;


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
app.get('/', (req, res) => res.render('index.ejs', {
  expressport: expressport
}));

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

// Helper function to remove circular references in object so we can print it out
JSON.decycle=function(n,e){"use strict";var t=new WeakMap;return function n(o,r){var c,i;return void 0!==e&&(o=e(o)),"object"!=typeof o||null===o||o instanceof Boolean||o instanceof Date||o instanceof Number||o instanceof RegExp||o instanceof String?o:void 0!==(c=t.get(o))?{$ref:c}:(t.set(o,r),Array.isArray(o)?(i=[],o.forEach(function(e,t){i[t]=n(e,r+"["+t+"]")})):(i={},Object.keys(o).forEach(function(e){i[e]=n(o[e],r+"["+JSON.stringify(e)+"]")})),i)}(n,"$")};

// POST query --> Process query (json) and return result (json)
app.post('/query', (req, res) => {
  // res.json(JSON.decycle(req)); // For debugging, uncomment this to inspect req
  poolquery(req.body, res);
});

// Starts the server
app.listen(expressport, () => {
  console.log('started website on localhost:' + expressport);
});

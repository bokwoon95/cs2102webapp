# Setup
Make sure you have npm, then run
```
npm install
```
to install all dependencies

# Configuration
You will need your postgres username and password. If you do not know your username and password, you can look for your username in psql and change the password for that username to something you know:
```sql
CREATE DATABASE shareleh; -- If you haven't already created a shareleh database
\du -- get your username
ALTER USER <username> WITH PASSWORD <password>; -- set password for username (if you have forgotten it)
\i db/init.sql -- setup initial tables
```
Make a copy of `.env.sample` and rename it to `.env`. It should look something like this (some of the entries are already filled out because they should be the same for everyone) Open `.env` and fill in DB_USER and DB_PASSWORD.
```
DB_USER=
DB_HOST=localhost
DB_DATABASE=shareleh
DB_PASSWORD=
DB_PORT=5432
```
Later on you can reference these variables in your code by calling `process.env.<variable_name>`, e.g. `process.env.DB_PASSWORD`.


# Running the website
To start the server, run
```
npm start
```
and visit `localhost:3000`

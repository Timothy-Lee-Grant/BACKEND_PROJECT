const { Pool } = require('pg');

//docker container database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//for local mac db
/*
const pool = new Pool({
  host: 'host.docker.internal', // this lets Docker containers reach your Mac
  port: 5432,                   // default PostgreSQL port
  user: 'youruser',            // same as your local DB user
  password: 'yourpassword',    // your local DB password
  database: 'inventorydb'      // your local DB name
});
//need to
//listen_addresses = '*'
//host all all 172.17.0.0/16 md5
*/


module.exports = pool;

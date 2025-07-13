// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // şifreni yaz
  database: 'recipe_db'
});

module.exports = pool.promise();

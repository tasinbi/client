const mysql = require('mysql2');
require('dotenv').config();

console.log('Testing database connection...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Database connected successfully!');
  
  // Test admin query
  connection.query('SELECT * FROM admins', (error, results) => {
    if (error) {
      console.error('❌ Admin query failed:', error.message);
    } else {
      console.log('✅ Admin table found:', results.length, 'records');
      console.log('Admin records:', results);
    }
    
    connection.end();
  });
});

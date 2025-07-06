const mysql = require('mysql2');
require('dotenv').config();

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
  
  // Update admin password to plain text
  connection.query("UPDATE admins SET password = 'admin123' WHERE username = 'admin'", (error, results) => {
    if (error) {
      console.error('❌ Password update failed:', error.message);
    } else {
      console.log('✅ Admin password updated to plain text');
      console.log('Updated records:', results.affectedRows);
    }
    
    connection.end();
  });
});

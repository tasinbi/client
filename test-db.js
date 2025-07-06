const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  try {
    console.log('Connecting to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Database connected successfully!');
    
    // Test admin table
    const [adminRows] = await connection.execute('SELECT * FROM admins');
    console.log('✅ Admin table found with', adminRows.length, 'records');
    
    // Test categories table
    const [categoryRows] = await connection.execute('SELECT * FROM categories');
    console.log('✅ Categories table found with', categoryRows.length, 'records');
    
    // Test blogs table
    const [blogRows] = await connection.execute('SELECT * FROM blogs');
    console.log('✅ Blogs table found with', blogRows.length, 'records');
    
    await connection.end();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check:');
    console.error('1. XAMPP MySQL service is running');
    console.error('2. Database "blog_db" exists');
    console.error('3. Tables are created properly');
  }
}

testDatabaseConnection();

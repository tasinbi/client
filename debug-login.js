const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugLogin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Check admin data
    const [rows] = await connection.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
    
    if (rows.length === 0) {
      console.log('❌ No admin found with username "admin"');
      return;
    }
    
    const admin = rows[0];
    console.log('✅ Admin found:', admin.username);
    console.log('Stored password hash:', admin.password);
    
    // Test password
    const testPassword = 'admin123';
    console.log('Testing password:', testPassword);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match. Creating new hash...');
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('New hash:', newHash);
      
      // Update password
      await connection.execute('UPDATE admins SET password = ? WHERE username = ?', [newHash, 'admin']);
      console.log('✅ Password updated successfully!');
      
      // Test again
      const [newRows] = await connection.execute('SELECT * FROM admins WHERE username = ?', ['admin']);
      const newAdmin = newRows[0];
      const newMatch = await bcrypt.compare(testPassword, newAdmin.password);
      console.log('New password test:', newMatch);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugLogin();

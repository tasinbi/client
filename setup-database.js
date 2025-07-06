const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

// SQL statements
const sqlStatements = `
CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(100) NOT NULL,
  category_id INT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert default admin (password: admin123)
INSERT IGNORE INTO admins (username, password) VALUES 
('admin', 'admin123');

-- Insert default categories
INSERT IGNORE INTO categories (name) VALUES 
('Technology'),
('Travel'),
('Food'),
('Lifestyle'),
('Business');
`;

// Execute SQL
connection.query(sqlStatements, (error, results) => {
  if (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
  
  console.log('✅ Database created successfully!');
  console.log('✅ Tables created successfully!');
  console.log('✅ Default admin user created (username: admin, password: admin123)');
  console.log('✅ Default categories created');
  
  connection.end();
});

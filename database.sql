CREATE DATABASE IF NOT EXISTS new_blog_biic;
USE new_blog_biic;

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
  meta_keywords VARCHAR(500) DEFAULT NULL,
  meta_description TEXT DEFAULT NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Add views column to existing blogs table if it doesn't exist
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- Add SEO fields to existing blogs table if they don't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS meta_keywords VARCHAR(500) DEFAULT NULL AFTER image,
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT NULL AFTER meta_keywords;

-- Insert default admin (password: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', 'admin123');

-- Insert default categories
INSERT INTO categories (name) VALUES 
('Technology'),
('Travel'),
('Food'),
('Lifestyle'),
('Business');

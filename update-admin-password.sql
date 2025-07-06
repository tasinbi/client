-- Update admin password to 'admin123'
-- Copy this SQL and run in phpMyAdmin

UPDATE admins SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin';

-- Check if update was successful
SELECT username, password FROM admins WHERE username = 'admin';

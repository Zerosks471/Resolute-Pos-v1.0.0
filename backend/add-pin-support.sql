-- Add PIN column to users table
ALTER TABLE users ADD COLUMN pin VARCHAR(6) DEFAULT NULL;

-- Update test users with PINs
UPDATE users SET pin = '1234' WHERE username = 'admin';
UPDATE users SET pin = '5678' WHERE username = 'sam12';
UPDATE users SET pin = '9999' WHERE username = 'will24';
UPDATE users SET pin = '1111' WHERE username = 'renny99';
UPDATE users SET pin = '2222' WHERE username = 'rina24';
UPDATE users SET pin = '3333' WHERE username = 'nancy20';

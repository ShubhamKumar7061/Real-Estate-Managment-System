CREATE DATABASE realestate_db;
USE realestate_db;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(20)
);
CREATE TABLE properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    location VARCHAR(100),
    price INT,
    type VARCHAR(50),
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);
INSERT INTO users (name, email, password, role) VALUES
('Rahul', 'rahul@gmail.com', '1234', 'buyer'),
('Anurag', 'anurag@gmail.com', '1234', 'seller');
INSERT INTO properties (title, location, price, type, owner_id) VALUES
('2BHK Flat', 'Bangalore', 5000000, 'Flat', 2);

SELECT 
    p.property_id,
    p.title,
    p.location,
    p.price,
    u.name AS owner_name,
    u.email
FROM properties p
JOIN users u ON p.owner_id = u.user_id;
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    user_id INT,
    booking_date DATE,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO bookings (property_id, user_id, booking_date)
VALUES (1, 1, '2026-03-29');

SELECT 
    b.booking_id,
    u.name AS user_name,
    p.title AS property,
    p.location,
    p.price,
    b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN properties p ON b.property_id = p.property_id;

ALTER TABLE bookings
DROP FOREIGN KEY bookings_ibfk_1;

ALTER TABLE bookings
ADD CONSTRAINT bookings_ibfk_1
FOREIGN KEY (property_id)
REFERENCES properties(property_id)
ON DELETE CASCADE;

UPDATE users 
SET name = 'Shubham Kumar',
    email = 'shubhamkumar@gmail.com',
    password = '12345'
WHERE user_id = 1;

CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  property_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE messages ADD receiver_id INT;

SELECT * FROM messages;
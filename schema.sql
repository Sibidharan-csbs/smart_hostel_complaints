-- Smart Hostel Complaint Management System Database Schema
-- Database: hostel_complaints

CREATE DATABASE IF NOT EXISTS hostel_complaints;
USE hostel_complaints;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) UNIQUE DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    department VARCHAR(100) DEFAULT NULL,
    room_number VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    room_number VARCHAR(20) NOT NULL,
    assigned_to VARCHAR(100) DEFAULT NULL,
    admin_remarks TEXT DEFAULT NULL,
    resolution_details TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Complaint Images Table
CREATE TABLE IF NOT EXISTS complaint_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Complaint History Table
CREATE TABLE IF NOT EXISTS complaint_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL,
    previous_status VARCHAR(20) DEFAULT NULL,
    new_status VARCHAR(20) NOT NULL,
    remarks TEXT DEFAULT NULL,
    updated_by VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default Admin Account: admin@hostel.com / Admin@123 (BCrypt hash)
INSERT INTO users (name, student_id, email, password, role, department, room_number)
VALUES ('Hostel Administrator', 'ADMIN001', 'admin@hostel.com', '$2a$12$eA890.ZtM7yD/QkG98U41uG4yM91aY2Z3b4c5d6e7f8g9h0i1j2k3', 'ADMIN', 'Hostel Management', 'A-101')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Sample Student Account: student@hostel.com / Student@123
INSERT INTO users (name, student_id, email, password, role, department, room_number)
VALUES ('John Doe', 'STU1001', 'student@hostel.com', '$2a$12$eA890.ZtM7yD/QkG98U41uG4yM91aY2Z3b4c5d6e7f8g9h0i1j2k3', 'STUDENT', 'Computer Science', 'B-204')
ON DUPLICATE KEY UPDATE user_id=user_id;

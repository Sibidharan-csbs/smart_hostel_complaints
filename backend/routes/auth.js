const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken, requireRole, JWT_SECRET } = require('../middleware/auth');

// Register a Student
router.post('/register', async (req, res) => {
  const { name, email, password, rollNumber, block, room } = req.body;

  if (!name || !email || !password || !rollNumber || !block || !room) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email or roll number already exists
    const existingEmail = db.users.getByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const existingRoll = db.users.getByRollNumber(rollNumber);
    if (existingRoll) {
      return res.status(400).json({ message: 'User with this roll number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = db.users.add({
      name,
      email,
      password: hashedPassword,
      role: 'Student',
      rollNumber,
      block,
      room,
      staffCategory: null
    });

    // Create JWT
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, block: newUser.block, room: newUser.room },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        rollNumber: newUser.rollNumber,
        block: newUser.block,
        room: newUser.room
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login (Student, Staff, Warden)
router.post('/login', async (req, res) => {
  const { loginIdentifier, password } = req.body; // Can be email or roll number

  if (!loginIdentifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Attempt lookup by email first, then roll number
    let user = db.users.getByEmail(loginIdentifier);
    if (!user) {
      user = db.users.getByRollNumber(loginIdentifier);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        block: user.block, 
        room: user.room,
        staffCategory: user.staffCategory
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        block: user.block,
        room: user.room,
        staffCategory: user.staffCategory
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch current user details
router.get('/me', authenticateToken, (req, res) => {
  const user = db.users.getById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNumber: user.rollNumber,
    block: user.block,
    room: user.room,
    staffCategory: user.staffCategory
  });
});

// Fetch all staff members (Warden access only, to assign tasks)
router.get('/staff', authenticateToken, requireRole(['Warden']), (req, res) => {
  const allUsers = db.users.getAll();
  const staff = allUsers
    .filter(u => u.role === 'Staff')
    .map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      staffCategory: u.staffCategory // e.g. Plumber, Electrician
    }));

  res.json(staff);
});

module.exports = router;

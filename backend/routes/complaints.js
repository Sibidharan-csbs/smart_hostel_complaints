const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Setup multer storage for uploaded photos
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG/PNG/GIF/WEBP) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// CREATE a new complaint (Student role only)
router.post('/', authenticateToken, requireRole(['Student']), upload.single('image'), (req, res) => {
  const { title, description, category, severity } = req.body;

  if (!title || !description || !category || !severity) {
    // If a file was uploaded but validation fails, delete the uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newComplaint = db.complaints.add({
      studentId: req.user.id,
      studentName: req.user.name,
      roomNumber: req.user.room,
      block: req.user.block,
      title,
      description,
      category,
      severity,
      imagePath
    });

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Error filing complaint' });
  }
});

// GET complaints list based on role
router.get('/', authenticateToken, (req, res) => {
  try {
    const { role, id } = req.user;
    let list = [];

    if (role === 'Warden') {
      list = db.complaints.getAll();
    } else if (role === 'Staff') {
      list = db.complaints.getByAssignedTo(id);
    } else if (role === 'Student') {
      list = db.complaints.getByStudentId(id);
    }

    // Sort by date (newest first)
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET complaint details (with message thread and timeline logs)
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  try {
    const ticket = db.complaints.getById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Access control checks
    if (req.user.role === 'Student' && ticket.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'Staff' && ticket.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chatHistory = db.messages.getByComplaintId(id);
    const timelineEvents = db.timeline.getByComplaintId(id);

    res.json({
      complaint: ticket,
      messages: chatHistory,
      timeline: timelineEvents
    });
  } catch (error) {
    console.error('Error fetching complaint details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ASSIGN a complaint to staff (Warden only)
router.patch('/:id/assign', authenticateToken, requireRole(['Warden']), (req, res) => {
  const { id } = req.params;
  const { staffId } = req.body;

  if (!staffId) {
    return res.status(400).json({ message: 'Staff ID is required' });
  }

  try {
    const ticket = db.complaints.getById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const staffUser = db.users.getById(staffId);
    if (!staffUser || staffUser.role !== 'Staff') {
      return res.status(404).json({ message: 'Maintenance staff not found' });
    }

    const updatedTicket = db.complaints.update(id, {
      assignedTo: staffId,
      status: 'Assigned'
    });

    db.timeline.add(id, 'Assigned', `Assigned to ${staffUser.name} (${staffUser.staffCategory})`);

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error assigning staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE status of a complaint
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body; // note is optional details

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const ticket = db.complaints.getById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Role restrictions for status updates
    if (req.user.role === 'Student') {
      // Students can only close resolved complaints
      if (status !== 'Closed') {
        return res.status(403).json({ message: 'Students can only close resolved complaints' });
      }
      if (ticket.status !== 'Resolved') {
        return res.status(400).json({ message: 'Complaint is not yet resolved' });
      }
    } else if (req.user.role === 'Staff') {
      // Staff can change status of tickets assigned to them to In Progress or Resolved
      if (ticket.assignedTo !== req.user.id) {
        return res.status(403).json({ message: 'This complaint is not assigned to you' });
      }
      if (!['In Progress', 'Resolved'].includes(status)) {
        return res.status(403).json({ message: 'Staff can only update to In Progress or Resolved' });
      }
    }

    // Update status
    const updatedTicket = db.complaints.update(id, { status });
    
    // Add timeline log
    const desc = note ? `Status updated to ${status}. Details: ${note}` : `Status updated to ${status}`;
    db.timeline.add(id, status, desc);

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD message/comment to complaint chat
router.post('/:id/messages', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message text is required' });
  }

  try {
    const ticket = db.complaints.getById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Access control
    if (req.user.role === 'Student' && ticket.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'Staff' && ticket.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newMessage = db.messages.add(id, req.user.id, req.user.name, message);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// SUBMIT feedback/rating (Student only)
router.post('/:id/feedback', authenticateToken, requireRole(['Student']), (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Valid rating (1 to 5) is required' });
  }

  try {
    const ticket = db.complaints.getById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (ticket.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Force status to Closed when feedback is submitted
    const updatedTicket = db.complaints.update(id, {
      rating: parseInt(rating),
      feedback: feedback || '',
      status: 'Closed'
    });

    db.timeline.add(id, 'Closed', `Complaint closed with rating ${rating}/5`);

    res.json(updatedTicket);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/stats', authenticateToken, requireRole(['Warden']), (req, res) => {
  try {
    const complaints = db.complaints.getAll();
    const timeline = db.timeline;

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const assigned = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    // Calculate category distribution
    const categories = {};
    complaints.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    // Calculate average resolution time (in hours)
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    complaints.forEach(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') {
        const events = timeline.getByComplaintId(c.id);
        const resolvedEvent = events.find(e => e.status === 'Resolved');
        if (resolvedEvent) {
          const start = new Date(c.createdAt);
          const end = new Date(resolvedEvent.createdAt);
          const diffMs = end - start;
          const diffHours = diffMs / (1000 * 60 * 60);
          totalResolutionTime += diffHours;
          resolvedCount++;
        }
      }
    });

    const averageResolutionTimeHours = resolvedCount > 0 
      ? Math.round((totalResolutionTime / resolvedCount) * 10) / 10 
      : 0;

    res.json({
      summary: {
        total,
        pending,
        assigned,
        inProgress,
        resolved,
        averageResolutionHours: averageResolutionTimeHours
      },
      categories,
      recentComplaints: complaints.slice(-5) // Get latest 5
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

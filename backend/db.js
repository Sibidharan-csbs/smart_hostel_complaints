const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize empty DB if it doesn't exist
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      complaints: [],
      messages: [],
      timeline: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Read entire database
function readDb() {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON database:', error);
    return { users: [], complaints: [], messages: [], timeline: [] };
  }
}

// Write entire database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to JSON database:', error);
    return false;
  }
}

// Helper: Users
const users = {
  getAll: () => readDb().users,
  getById: (id) => readDb().users.find(u => u.id === id),
  getByEmail: (email) => readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getByRollNumber: (roll) => readDb().users.find(u => u.rollNumber && u.rollNumber.toLowerCase() === roll.toLowerCase()),
  add: (user) => {
    const db = readDb();
    const newUser = { id: Date.now().toString(), ...user };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  }
};

// Helper: Complaints
const complaints = {
  getAll: () => readDb().complaints,
  getById: (id) => readDb().complaints.find(c => c.id === id),
  getByStudentId: (studentId) => readDb().complaints.filter(c => c.studentId === studentId),
  getByAssignedTo: (staffId) => readDb().complaints.filter(c => c.assignedTo === staffId),
  add: (complaint) => {
    const db = readDb();
    const newComplaint = {
      id: Date.now().toString(),
      status: 'Pending',
      assignedTo: null,
      rating: null,
      feedback: null,
      createdAt: new Date().toISOString(),
      ...complaint
    };
    db.complaints.push(newComplaint);
    writeDb(db);

    // Add initial timeline entry
    timeline.add(newComplaint.id, 'Pending', 'Complaint filed by student');

    return newComplaint;
  },
  update: (id, updates) => {
    const db = readDb();
    const index = db.complaints.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    db.complaints[index] = { ...db.complaints[index], ...updates };
    writeDb(db);
    return db.complaints[index];
  }
};

// Helper: Messages
const messages = {
  getByComplaintId: (complaintId) => readDb().messages.filter(m => m.complaintId === complaintId),
  add: (complaintId, senderId, senderName, messageText) => {
    const db = readDb();
    const newMessage = {
      id: Date.now().toString(),
      complaintId,
      senderId,
      senderName,
      message: messageText,
      createdAt: new Date().toISOString()
    };
    db.messages.push(newMessage);
    writeDb(db);
    return newMessage;
  }
};

// Helper: Timeline
const timeline = {
  getByComplaintId: (complaintId) => readDb().timeline.filter(t => t.complaintId === complaintId),
  add: (complaintId, status, description) => {
    const db = readDb();
    const newEvent = {
      id: Date.now().toString(),
      complaintId,
      status,
      description,
      createdAt: new Date().toISOString()
    };
    db.timeline.push(newEvent);
    writeDb(db);
    return newEvent;
  }
};

module.exports = {
  users,
  complaints,
  messages,
  timeline
};

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const mockUsers = [
    {
      id: 'student_1',
      name: 'Adithya Kumar',
      email: 'student@hostel.com',
      password: passwordHash,
      role: 'Student',
      rollNumber: '717821C201',
      block: 'Kaveri Block',
      room: '304-B',
      staffCategory: null
    },
    {
      id: 'student_2',
      name: 'Rohan Sharma',
      email: 'rohan@hostel.com',
      password: passwordHash,
      role: 'Student',
      rollNumber: '717821C205',
      block: 'Ganga Block',
      room: '102-A',
      staffCategory: null
    },
    {
      id: 'warden_1',
      name: 'Dr. Srinivasan Pillai',
      email: 'warden@hostel.com',
      password: passwordHash,
      role: 'Warden',
      rollNumber: null,
      block: null,
      room: null,
      staffCategory: null
    },
    {
      id: 'staff_elec',
      name: 'Ramesh Kumar',
      email: 'electrician@hostel.com',
      password: passwordHash,
      role: 'Staff',
      rollNumber: null,
      block: null,
      room: null,
      staffCategory: 'Electrical'
    },
    {
      id: 'staff_plumb',
      name: 'Muthu Swamy',
      email: 'plumber@hostel.com',
      password: passwordHash,
      role: 'Staff',
      rollNumber: null,
      block: null,
      room: null,
      staffCategory: 'Plumbing'
    },
    {
      id: 'staff_carp',
      name: 'Vikram Singh',
      email: 'carpenter@hostel.com',
      password: passwordHash,
      role: 'Staff',
      rollNumber: null,
      block: null,
      room: null,
      staffCategory: 'Carpentry'
    }
  ];

  const mockComplaints = [
    {
      id: 'complaint_1',
      studentId: 'student_1',
      studentName: 'Adithya Kumar',
      roomNumber: '304-B',
      block: 'Kaveri Block',
      title: 'Ceiling fan making loud noise',
      description: 'The ceiling fan in room 304-B is wobbling heavily and making a loud grinding noise on speeds 3 and above. It is impossible to sleep.',
      category: 'Electrical',
      severity: 'Medium',
      status: 'Pending',
      imagePath: null,
      assignedTo: null,
      rating: null,
      feedback: null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 'complaint_2',
      studentId: 'student_2',
      studentName: 'Rohan Sharma',
      roomNumber: '102-A',
      block: 'Ganga Block',
      title: 'Flush tank leaking water',
      description: 'The flush tank in our bathroom is continuously leaking water into the bowl, wasting a lot of water and creating a wet mess on the floor.',
      category: 'Plumbing',
      severity: 'High',
      status: 'Assigned',
      imagePath: null,
      assignedTo: 'staff_plumb',
      rating: null,
      feedback: null,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'complaint_3',
      studentId: 'student_1',
      studentName: 'Adithya Kumar',
      roomNumber: '304-B',
      block: 'Kaveri Block',
      title: 'Broken window latch',
      description: 'The window latch on the left window is broken, so it cannot lock. Heavy winds open it automatically.',
      category: 'Carpentry',
      severity: 'Low',
      status: 'Resolved',
      imagePath: null,
      assignedTo: 'staff_carp',
      rating: 5,
      feedback: 'Very quick resolution! Thank you.',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ];

  const mockTimeline = [
    {
      id: 'tl_1',
      complaintId: 'complaint_1',
      status: 'Pending',
      description: 'Complaint filed by student',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_2',
      complaintId: 'complaint_2',
      status: 'Pending',
      description: 'Complaint filed by student',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_3',
      complaintId: 'complaint_2',
      status: 'Assigned',
      description: 'Assigned to Muthu Swamy (Plumbing)',
      createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_4',
      complaintId: 'complaint_3',
      status: 'Pending',
      description: 'Complaint filed by student',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_5',
      complaintId: 'complaint_3',
      status: 'Assigned',
      description: 'Assigned to Vikram Singh (Carpentry)',
      createdAt: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_6',
      complaintId: 'complaint_3',
      status: 'In Progress',
      description: 'Status updated to In Progress. Details: Replacing structural clamp.',
      createdAt: new Date(Date.now() - 65 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_7',
      complaintId: 'complaint_3',
      status: 'Resolved',
      description: 'Status updated to Resolved. Details: Fixed latch and reinforced window frame.',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 'tl_8',
      complaintId: 'complaint_3',
      status: 'Closed',
      description: 'Complaint closed with rating 5/5',
      createdAt: new Date(Date.now() - 58 * 60 * 1000).toISOString()
    }
  ];

  const mockMessages = [
    {
      id: 'msg_1',
      complaintId: 'complaint_2',
      senderId: 'staff_plumb',
      senderName: 'Muthu Swamy',
      message: 'Hello, I will visit your room tomorrow morning between 10 AM to 12 PM to look at the leak. Please make sure someone is in the room.',
      createdAt: new Date(Date.now() - 38 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'msg_2',
      complaintId: 'complaint_2',
      senderId: 'student_2',
      senderName: 'Rohan Sharma',
      message: 'Sure Ramesh, my roommate will be there. Thank you for the quick update.',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    }
  ];

  const dbData = {
    users: mockUsers,
    complaints: mockComplaints,
    timeline: mockTimeline,
    messages: mockMessages
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log('Database seeded successfully!');
}

seed();

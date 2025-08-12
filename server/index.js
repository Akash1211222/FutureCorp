const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
const users = [];
const assignments = [];
const liveClasses = [];

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: password, // In production, hash this
      role,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assignment Routes
app.post('/api/assignments', (req, res) => {
  try {
    const assignment = {
      id: Date.now().toString(),
      ...req.body,
      createdBy: 'teacher',
      createdAt: new Date()
    };

    assignments.push(assignment);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/assignments', (req, res) => {
  try {
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Live Classes Routes
app.post('/api/live-classes', (req, res) => {
  try {
    const liveClass = {
      id: Date.now().toString(),
      ...req.body,
      createdBy: 'teacher',
      createdAt: new Date(),
      participants: [],
      isLive: false
    };

    liveClasses.push(liveClass);
    res.status(201).json(liveClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/live-classes', (req, res) => {
  try {
    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/live-classes/:id/start', (req, res) => {
  try {
    const classId = req.params.id;
    const liveClass = liveClasses.find(c => c.id === classId);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    liveClass.isLive = true;
    liveClass.startedAt = new Date();

    res.json({ message: 'Class started successfully', liveClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/live-classes/:id/join', (req, res) => {
  try {
    const classId = req.params.id;
    const liveClass = liveClasses.find(c => c.id === classId);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const userId = req.body.userId || 'student';
    if (!liveClass.participants.includes(userId)) {
      liveClass.participants.push(userId);
    }

    res.json({ message: 'Joined class successfully', liveClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (for teachers to assign work)
app.get('/api/users', (req, res) => {
  try {
    const userList = users
      .filter(user => user.role === 'student')
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));

    res.json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
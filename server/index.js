const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
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

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
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

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Assignment Routes
app.post('/api/assignments', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create assignments' });
    }

    const assignment = {
      id: Date.now().toString(),
      ...req.body,
      createdBy: req.user.userId,
      createdAt: new Date()
    };

    assignments.push(assignment);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/assignments', authenticateToken, (req, res) => {
  try {
    let userAssignments;
    
    if (req.user.role === 'teacher') {
      userAssignments = assignments.filter(assignment => assignment.createdBy === req.user.userId);
    } else {
      userAssignments = assignments.filter(assignment => 
        assignment.assignedTo.includes(req.user.userId)
      );
    }

    res.json(userAssignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Live Classes Routes
app.post('/api/live-classes', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create live classes' });
    }

    const liveClass = {
      id: Date.now().toString(),
      ...req.body,
      createdBy: req.user.userId,
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

app.get('/api/live-classes', authenticateToken, (req, res) => {
  try {
    let userClasses;
    
    if (req.user.role === 'teacher') {
      userClasses = liveClasses.filter(liveClass => liveClass.createdBy === req.user.userId);
    } else {
      userClasses = liveClasses.filter(liveClass => 
        liveClass.assignedTo && liveClass.assignedTo.includes(req.user.userId)
      );
    }

    res.json(userClasses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/live-classes/:id/start', authenticateToken, (req, res) => {
  try {
    const classId = req.params.id;
    const liveClass = liveClasses.find(c => c.id === classId && c.createdBy === req.user.userId);
    
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

app.post('/api/live-classes/:id/join', authenticateToken, (req, res) => {
  try {
    const classId = req.params.id;
    const liveClass = liveClasses.find(c => c.id === classId);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (!liveClass.participants.includes(req.user.userId)) {
      liveClass.participants.push(req.user.userId);
    }

    res.json({ message: 'Joined class successfully', liveClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (for teachers to assign work)
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view users' });
    }

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
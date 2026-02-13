const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/users.json');

// Helper: Read users from file
const getUsers = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper: Write users to file
const saveUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// GET /api/users - Get all users (supports filtering)
router.get('/', (req, res) => {
  try {
    let users = getUsers();
    
    // Query filtering
    const { active, role, search } = req.query;
    
    if (active !== undefined) {
      users = users.filter(u => u.active === (active === 'true'));
    }
    
    if (role) {
      users = users.filter(u => u.role.toLowerCase().includes(role.toLowerCase()));
    }
    
    if (search) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Validation
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and role are required'
      });
    }
    
    const users = getUsers();
    
    // Check duplicate email
    if (users.some(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      role,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    res.status(201)
      .location(`/api/users/${newUser.id}`)
      .json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// PUT /api/users/:id - Update user (full update - idempotent)
router.put('/:id', (req, res) => {
  try {
    const { name, email, role, active } = req.body;
    
    // Validation
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and role are required'
      });
    }
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check duplicate email (except current user)
    if (users.some(u => u.email === email && u.id !== parseInt(req.params.id))) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // Update user (keeping id and createdAt)
    users[index] = {
      ...users[index],
      name,
      email,
      role,
      active: active !== undefined ? active : users[index].active,
      updatedAt: new Date().toISOString()
    };
    
    saveUsers(users);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// PATCH /api/users/:id - Partial update
router.patch('/:id', (req, res) => {
  try {
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update fields provided'
      });
    }
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check duplicate email if updating email
    if (updates.email && users.some(u => u.email === updates.email && u.id !== parseInt(req.params.id))) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // Apply partial update
    users[index] = {
      ...users[index],
      ...updates,
      id: users[index].id, // Prevent ID change
      createdAt: users[index].createdAt, // Prevent createdAt change
      updatedAt: new Date().toISOString()
    };
    
    saveUsers(users);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const users = getUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const deletedUser = users.splice(index, 1)[0];
    saveUsers(users);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// HEAD /api/users - Check if users exist
router.head('/', (req, res) => {
  try {
    const users = getUsers();
    res.set('X-Total-Count', users.length);
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
});

// OPTIONS /api/users - Return allowed methods
router.options('/', (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
});

router.options('/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.status(200).end();
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get members based on logged-in user's role
router.get('/', async (req, res) => {
  try {
    const role = req.query.role; // optional query to filter by role
    let filter = {};
    if (role === 'team') filter = { accountType: 'team' };

    const users = await User.find(filter, 'name email accountType role');
    res.json(users);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for logged-in user
router.get('/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const messages = await Message.find({
      $or: [
        { receiver: 'Everyone' },
        { receiver: username },
        { sender: username }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', async (req, res) => {
  const { sender, receiver, content } = req.body;
  if (!sender || !receiver || !content) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;

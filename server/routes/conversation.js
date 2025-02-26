const express = require('express');
const router = express.Router();
const Conversation = require('../model/conversationModel');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * GET /api/conversations
 * Retrieves all conversations that the authenticated user is a participant in.
 */
router.get('/', async (req, res) => {
  try {
    // Assume req.user.id holds the current user's ID.
    const userId = req.user && req.user.id; 
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    // Find conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId
    }).populate('participants', 'username avatar'); // Populate for display purposes

    res.status(200).json(conversations);
  } catch (err) {
    console.error('Error retrieving conversations:', err);
    res.status(500).json({ error: 'Failed to retrieve conversations.' });
  }
});

/**
 * GET /api/conversations/:conversationId/messages
 * Retrieves messages for a specific conversation.
 */
router.get('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate('messages.sender', 'username avatar');
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    res.status(200).json(conversation.messages);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

module.exports = router;

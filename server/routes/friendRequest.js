const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const authenticateToken = require('../middleware/authMiddleware');

// Use the authentication middleware for all friend request routes
router.use(authenticateToken);

// Send friend request: POST /api/friend-request
router.post('/', async (req, res) => {
  try {
    // senderId comes from the token (req.user.id)
    const senderId = req.user.id;
    const { receiverId } = req.body;
    if (!receiverId)
      return res.status(400).json({ error: 'Receiver ID is required.' });

    // Check if users exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver)
      return res.status(400).json({ error: 'User not found.' });

    // Prevent duplicate requests
    if (sender.friendRequests.outgoing.includes(receiverId)) {
      return res.status(400).json({ error: 'Friend request already sent.' });
    }

    // Update sender's outgoing and receiver's incoming lists
    sender.friendRequests.outgoing.push(receiverId);
    receiver.friendRequests.incoming.push(senderId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request sent.' });
  } catch (err) {
    console.error('Error sending friend request:', err);
    res.status(500).json({ error: 'Error sending friend request.' });
  }
});

// Accept friend request: POST /api/friend-request/accept
router.post('/accept', async (req, res) => {
  try {
    // The current user is the receiver
    const receiverId = req.user.id;
    const { senderId } = req.body;
    if (!senderId)
      return res.status(400).json({ error: 'Sender ID is required.' });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver)
      return res.status(400).json({ error: 'User not found.' });

    // Remove friend request entries
    receiver.friendRequests.incoming = receiver.friendRequests.incoming.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequests.outgoing = sender.friendRequests.outgoing.filter(
      (id) => id.toString() !== receiverId
    );

    // Add each other as friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request accepted.' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ error: 'Error accepting friend request.' });
  }
});

// Reject friend request: POST /api/friend-request/reject
router.post('/reject', async (req, res) => {
  try {
    const receiverId = req.user.id;
    const { senderId } = req.body;
    if (!senderId)
      return res.status(400).json({ error: 'Sender ID is required.' });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver)
      return res.status(400).json({ error: 'User not found.' });

    // Remove friend request entries without adding to friends list
    receiver.friendRequests.incoming = receiver.friendRequests.incoming.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequests.outgoing = sender.friendRequests.outgoing.filter(
      (id) => id.toString() !== receiverId
    );

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: 'Friend request rejected.' });
  } catch (err) {
    console.error('Error rejecting friend request:', err);
    res.status(500).json({ error: 'Error rejecting friend request.' });
  }
});

// Get incoming friend requests: GET /api/friend-request/incoming
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required.' });
    
    const currentUserId = req.user.id;
    
    // Search for users by username or email
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('username email avatar friendRequests friends');

    // Map over users to add friendStatus based on the current user's relationship with each user
    const usersWithStatus = users.map(user => {
      let friendStatus = 'none';
      // Check if the current user's id is present in the user's incoming or outgoing friend requests or friends list.
      if (user.friendRequests.incoming.some(id => id.toString() === currentUserId)) {
        friendStatus = 'waiting'; // The other user has sent you a friend request
      } else if (user.friendRequests.outgoing.some(id => id.toString() === currentUserId)) {
        friendStatus = 'waiting'; // You have sent them a friend request
      } else if (user.friends.some(id => id.toString() === currentUserId)) {
        friendStatus = 'friends';
      }
      return { ...user.toObject(), friendStatus };
    });

    res.status(200).json(usersWithStatus);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Error searching users.' });
  }
});

module.exports = router;

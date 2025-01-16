const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, checkBlacklist } =  require('../controllers/authController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', checkBlacklist, logoutUser);

// Example protected route
router.get('/protected', checkBlacklist, (req, res) => {
    res.status(200).json({ message: 'This is a protected route!' });
});

module.exports = router;
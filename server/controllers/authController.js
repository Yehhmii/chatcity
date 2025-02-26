const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const User = require('../model/userSchema');

// Initialize Redis Client
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379', // Connect to local Redis server
});

client.connect() // Ensure connection is established
    .then(() => console.log('Redis client connected.'))
    .catch((err) => console.error('Redis connection error:', err));


// Register User
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to register new user.' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful!', token, user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Failed to login.' });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.error('No token provided');
            return res.status(400).json({ error: 'Token is required for logout.' });
        }

        const decoded = jwt.decode(token);
        if (!decoded) {
            console.error('Invalid token provided');
            return res.status(400).json({ error: 'Invalid token.' });
        }

        const expiresIn = decoded.exp * 1000 - Date.now(); // Remaining time in ms
        if (expiresIn <= 0) {
            console.error('Token has already expired');
            return res.status(400).json({ error: 'Token has already expired.' });
        }

        console.log(`Blacklisting token with TTL: ${Math.floor(expiresIn / 1000)} seconds`);

        // Check if Redis client is connected
        if (client.isOpen) {
            await client.setEx(`blacklist:${token}`, Math.floor(expiresIn / 1000), token);
            return res.status(200).json({ message: 'Logout successful!' });
        } else {
            console.error('Redis client is not connected');
            return res.status(500).json({ error: 'Redis client is not connected.' });
        }
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ error: 'An error occurred during logout.' });
    }
};

// Middleware to Check Blacklisted Tokens
const checkBlacklist = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }

    try {
        const data = await client.get(`blacklist:${token}`);
        if (data) {
            return res.status(401).json({ error: 'Token is blacklisted.' });
        }
        next();
    } catch (err) {
        console.error('Redis error during blacklist check:', err);
        return res.status(500).json({ error: 'Redis error.' });
    }
};

module.exports = { registerUser, loginUser, logoutUser, checkBlacklist };

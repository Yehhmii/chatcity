const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');

// creating a router for the search point : GET api/users/search?quary=somevalue
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        if(!query) return res.status(400).json({error: 'Query parameter is required. '});

        // case-insensitive search by email or username
        const users = await User.find({
            $or: [
                { username: {$regex: query, $options: 'i' } },
                { email: {$regex: query, $options: 'i' } }
            ]
        }).select(' username email avatar');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error searching user.' });
    }
});

module.exports = router;
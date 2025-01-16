const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);

// socket
require('./socket')(server); // Passing the server to socket.js

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Mongodb Connected!')
    })
    .catch((error) => {
        console.log('error', error)
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Default test route
app.get('/', (req, res) => {
    res.send('Chatcity Backend Running');
});

const PORT = process.env.PORT || 5000; 
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

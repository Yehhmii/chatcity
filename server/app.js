const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { error } = require('console');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

//Middleware
app.use(express.json());
app.use(cors());

//Mongodb Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb Connected!')
    })
    .catch((error) => {
        console.log('error', error)
    });

//Socket IO connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
    });
});

// Default test route
app.get('/', (req, res) => {
    res.send('Chatcity Backend Running ');
});

const PORT = process.env.PORT 
server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

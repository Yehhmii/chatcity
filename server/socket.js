module.exports = (server) => {
    const { Server } = require('socket.io');
    const io = new Server(server, {
        cors: {
            origin: '*' // Update with your frontend URL for better security in production
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('send_message', (data) => {
            try {
                console.log('Message received:', data);
                socket.to(data.room).emit('receive_message', data);
            } catch (err) {
                console.error('Error handling message:', err);
            }
        });

        socket.on('join_room', (room) => {
            console.log(`User with ID: ${socket.id} joined room: ${room}`);
            socket.join(room);
        });

        socket.on('leave_room', (room) => {
            console.log(`User with ID: ${socket.id} left room: ${room}`);
            socket.leave(room);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

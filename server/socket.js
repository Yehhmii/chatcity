module.exports = (server) => {
    const { Server } = require('socket.io');
    const Conversation = require('./model/conversationModel');

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173' // Update with your frontend URL for better security in production
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // join a specific conversation room (ConversationId)
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
        });

        // listen  for incoming messages, save to DB, then broadcast
        socket.on('send_message', async (data) => {
            try {
                console.log('Message received:', data);
                // data should include conversationId, sender, and content etc
                // Find the conversation in the database
                const conversation = await Conversation.findById(data.conversationId);
                if (conversation) {
                    // Add the new message to the conversation's message array
                    conversation.messages.push({
                        sender: data.sender,
                        content: data.content,
                        timestamp: new Date()
                    });
                    conversation.updatedAt = new Date();
                    await conversation.save();
                } else {
                    console.error('Conversation not found:', data.conversationId);
                }
                // Broadcast the new message to all sockets in the conversation room (except the sender)
                socket.to(data.conversationId).emit('newMessage', data);
            } catch (err) {
                console.error('Error handling message:', err);
            }
        });

        // (Optional) Additional events such as joining/leaving generic rooms
        socket.on('join_room', (room) => {
            console.log(`Socket ${socket.id} joined room: ${room}`);
            socket.join(room);
        });

        socket.on('leave_room', (room) => {
            console.log(`Socket ${socket.id} left room: ${room}`);
            socket.leave(room);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

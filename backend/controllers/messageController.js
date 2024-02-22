module.exports = (io, onlineUsers) => {
  const Message = require('../models/messageModel');
  return (socket) => {
    console.log(
      `New connection ${socket.id} number of connections: ${io.engine.clientsCount}, token: ${socket.handshake.query.myToken}`
    );
    onlineUsers.set(socket.user._id.toString(), socket.user);
    io.emit(
      'online-users',
      [...onlineUsers].map(([name, value]) => value)
    );
    console.log('connecting...', onlineUsers);

    // @desc    Get messages from current time
    // @socket  ON "get-messages" event from client
    // @emit    "get-messages" event to client
    // @access  Private
    socket.on('get-messages', async () => {
      const messages = await Message.find();

      socket.emit('get-messages', messages);
    });

    // @desc    Create new message from user
    // @route   ON 'create-message' event from client
    // @emit    'new-message' event to all connected clients or 'create-my-message' / 'errorEvent' event to client
    // @access  Private
    socket.on('create-message', async (data) => {
      const { content } = data;
      if (!content) {
        socket.emit('errorEvent', new Error('Please include all fields'));
      }

      const message = await Message.create({
        user: socket.user._id,
        userName: socket.user.name,
        email: socket.user.email,
        gravatarUrl: socket.user.gravatarUrl,
        content,
      });

      if (message) {
        io.emit('new-message', message); // Emit the message to all connected clients
        // socket.emit('create-my-message', message);
      } else {
        socket.emit('errorEvent', new Error('Invalid user data'));
      }
    });

    // @desc    Get message by ID
    // @route   ON "get-message-by-id" event from client
    // @emit    "get-message-by-id" event to client or "errorEvent" event to client
    // @access  Private
    socket.on('get-message-by-id', async (id) => {
      const message = await Message.findById(id);
      if (!message) {
        socket.emit('errorEvent', new Error('Message Not found'));
      }

      if (message.user.toString() !== socket.user.id) {
        socket.emit('errorEvent', new Error('Not Autorized'));
      }

      socket.emit('get-message-by-id', message);
    });

    // @desc    Update message by ID
    // @route   ON 'update-message' event from client with message ID and data
    // @emit    'update-message' event to  online client or 'update-my-message' / 'errorEvent' event to client
    // @access  Private
    socket.on('update-message', async (id, data) => {
      if (!data || !id) {
        socket.emit(
          'errorEvent',
          new Error('Please include data you want to update')
        );
      }
      const message = await Message.findById(id);
      if (!message) {
        socket.emit('errorEvent', new Error('Message Not found'));
      }

      if (message.user.toString() !== socket.user.id) {
        socket.emit('errorEvent', new Error('Not Autorized'));
      }

      const updated = await Message.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updated) {
        socket.emit(
          'errorEvent',
          new Error('Problem accured while updating the message')
        );
      }
      io.emit('update-message', updated); // Emit the message to all connected clients
      // socket.emit('update-my-message', updated);
    });

    // @desc    delete message by ID
    // @route   ON "delete-message" event from client
    // @emit    "delete-message" event to all connected clients or "errorEvent" event to client
    // @access  Private
    socket.on('delete-message', async (id) => {
      if (id === null || id === undefined || id === '') {
        socket.emit('errorEvent', new Error('Please include all fields'));
      }
      const message = await Message.findById(id);
      if (!message) {
        socket.emit('errorEvent', new Error('Message Not found'));
      }
      if (message.user.toString() !== socket.user.id) {
        socket.emit('errorEvent', new Error('Not Autorized'));
      }

      await Message.findByIdAndDelete(id);
      io.emit('delete-message', id); // Emit the message to all connected clients
      socket.emit('delete-my-message', {
        message: 'Message removed seccessfully',
      });
    });
    socket.on('online-connection', () => {
      socket.emit('online-users', online - users);
      `Users connections count: ${io.engine.clientsCount}`;
    });
    socket.on('disconnect', () => {
      socket.disconnect();
      console.log(
        `Connection ${socket.id} has left, number of connections: ${io.engine.clientsCount}`
      );
      onlineUsers.delete(socket.user._id.toString());
      io.emit(
        'online-users',
        [...onlineUsers].map(([name, value]) => value)
      );
      console.log('disconnecting...', onlineUsers);
    });
    socket.on('force-disconnect', () => {
      socket.disconnect();
      // onlineUsers.delete(socket.user._id);
      console.log(
        `Connection has left, number of connections: ${io.engine.clientsCount}`
      );
      onlineUsers.delete(socket.user._id.toString());
      io.emit(
        'online-users',
        [...onlineUsers].map(([name, value]) => value)
      );
      console.log('disconnecting...', onlineUsers);
    });
  };
};

exports.handleConnection = socket => {
  socket.emit('welcome', { msg: 'welcome' });
  socket.on('start game', ({ msg }) => {
    console.log('ready to start');
  });
};

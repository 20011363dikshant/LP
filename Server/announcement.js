// // announcement.js

// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';

// const PORT = process.env.PORT || 4000;

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// let announcements = [];

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   // Send existing announcements to the newly connected client
//   socket.emit('announcements', announcements);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   // Receive new announcement from Mainadashboard
//   socket.on('newAnnouncement', (announcement) => {
//     announcements.push(announcement);
//     // Broadcast the new announcement to all connected clients including Edashboard
//     io.emit('announcements', announcements);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

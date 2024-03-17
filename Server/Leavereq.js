// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';

// const leaveData = {
//   casual: { available: 5, used: 0 },
//   sick: { available: 10, used: 0 },
//   earned: { available: 10, used: 0 },
//   adjustment: { available: 10, used: 0 },
//   unpaid: { available: 10, used: 0 },
//   half: { available: 10, used: 0 },
// };

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // MySQL connection for leave portal
// const leavePortalDb = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// // Connect to MySQL for leave portal
// leavePortalDb.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL database for leave portal:', err);
//     return;
//   }
//   console.log('Connected to MySQL database for leave portal');
  
//   // Create celebrations table if not exists
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS celebrations (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       message TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`;
  
//   leavePortalDb.query(createTableQuery, (err, result) => {
//     if (err) {
//       console.error('Error creating celebrations table:', err);
//     } else {
//       console.log('Celebrations table created or already exists');
//     }
//   });
// });


// // MySQL connection for main application
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Route to approve or reject leave requests
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

//   const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//   const updateValues = [status, requestId];

//   db.query(updateQuery, updateValues, async (error, updateResults) => {
//     if (error) {
//       console.error('Error updating leave request status:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Leave request ${action}ed successfully`);

//     const fetchQuery = 'SELECT * FROM leave_requests WHERE id = ?';
//     db.query(fetchQuery, [requestId], async (error, fetchResults) => {
//       if (error) {
//         console.error('Error fetching leave request details:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const leaveRequest = fetchResults[0];
//       const { leave_type } = leaveRequest;

//       // Update leave data
//       if (action === 'approve') {
//         // Decrement available leave and increment used leave for the approved request
//         leaveData[leave_type].available--;
//         leaveData[leave_type].used++;
//       }

//       // Update leave data in the database
//       const updateLeaveDataQuery = 'UPDATE leave_data SET available = ?, used = ? WHERE leave_type = ?';
//       const updateLeaveDataValues = [leaveData[leave_type].available, leaveData[leave_type].used, leave_type];

//       await db.query(updateLeaveDataQuery, updateLeaveDataValues);

//       // Copy leave request data to user_leave_history table
//       const insertQuery = 'INSERT INTO user_leave_history (employee_name, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//       const insertValues = [leaveRequest.employee_name, leaveRequest.start_date, leaveRequest.end_date, leaveRequest.reason, leaveRequest.status, leaveRequest.leave_type];

//       db.query(insertQuery, insertValues, (error, insertResults) => {
//         if (error) {
//           console.error('Error copying leave request to user_leave_history:', error.message);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
//         console.log('Leave request data copied to user_leave_history successfully');
//         res.status(200).json({ message: `Leave request ${action}ed successfully` });
//       });
//     });
//   });
// });



// // Route to fetch celebrations for this month
// app.get('/api/celebrations-this-month', (req, res) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
//   const currentYear = currentDate.getFullYear();

//   const query = `
//     SELECT * 
//     FROM celebrations 
//     WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
//     ORDER BY created_at DESC`; // Order by created_at column in descending order
//   db.query(query, [currentMonth, currentYear], (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });
// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations
//   const query = 'SELECT * FROM celebrations';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });


// // Route to handle celebration deletion
// app.delete('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM celebrations WHERE id = ?';
//   leavePortalDb.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} deleted successfully` });
//   });
// });



// // Route to handle PUT requests to update celebrations
// app.put('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE celebrations SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   leavePortalDb.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Socket.IO handling
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('newCelebration', (data) => {
//     const { celebration } = data;
//     const sql = 'INSERT INTO celebrations (message) VALUES (?)';
//     leavePortalDb.query(sql, [celebration], (error, result) => {
//       if (error) {
//         console.error('Error inserting celebration into database:', error);
//         return;
//       }
//       console.log('Celebration inserted into database:', result);
//       io.emit('celebrationInserted', { message: 'Celebration inserted successfully' });
//     });
//   });

//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return;
//     }
//     socket.emit('announcements', results);
//   });

//   socket.on('newAnnouncement', (announcement) => {
//     const { message } = announcement;
//     const query = 'INSERT INTO announcements (message) VALUES (?)';
//     const values = [message];
//     db.query(query, values, (error, results) => {
//       if (error) {
//         console.error('Error creating announcement:', error.message);
//         return;
//       }
//       console.log('Announcement created successfully');
//       io.emit('announcements', { id: results.insertId, message });
//     });
//   });
// });
// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations and order by created_at in descending order
//   const query = 'SELECT * FROM celebrations ORDER BY created_at DESC';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });

// // Route to handle GET requests to /api/user-leave-history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT * FROM user_leave_history';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle GET requests to /api/announcements
// app.get('/api/announcements', (req, res) => {
//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle DELETE requests to /api/announcements/:id
// app.delete('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
//   db.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} deleted successfully` });
//   });
// });

// // Route to fetch pending leave requests (GET)
// app.get('/api/pending-leave-requests', (req, res) => {
//   const query = 'SELECT * FROM leave_requests WHERE status = ?';
//   db.query(query, ['pending'], (error, results) => {
//     if (error) {
//       console.error('Error fetching pending leave requests:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { employee_name, start_date, end_date, reason, leave_type } = req.body;
//   const status = 'pending';

//   const query = 'INSERT INTO leave_requests (employee_name, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [employee_name, start_date, end_date, reason, status, leave_type];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log('Leave request inserted successfully');
//     res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
//   });
// });

// // Route to handle PUT requests to /api/announcements/:id
// app.put('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE announcements SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   db.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data', (req, res) => {
//   res.json(leaveData);
// });


// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data/:userId', (req, res) => {
//   const userId = req.params.userId;
//   // Replace this with your logic to fetch leave data for the given user ID
//   // For now, I'll just send the default leaveData object
//   res.json(leaveData);
// });
// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { leave_type } = req.body;
//   leaveData[leave_type].available--;
//   leaveData[leave_type].used++;
//   res.send('Leave request approved');
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });





























// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';

// const leaveData = {
//   casual: { available: 5, used: 0 },
//   sick: { available: 10, used: 0 },
//   earned: { available: 10, used: 0 },
//   adjustment: { available: 10, used: 0 },
//   unpaid: { available: 10, used: 0 },
//   half: { available: 10, used: 0 },
// };

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // MySQL connection for leave portal
// const leavePortalDb = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// // Connect to MySQL for leave portal
// leavePortalDb.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL database for leave portal:', err);
//     return;
//   }
//   console.log('Connected to MySQL database for leave portal');
  
//   // Create celebrations table if not exists
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS celebrations (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       message TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`;
  
//   leavePortalDb.query(createTableQuery, (err, result) => {
//     if (err) {
//       console.error('Error creating celebrations table:', err);
//     } else {
//       console.log('Celebrations table created or already exists');
//     }
//   });
// });


// // MySQL connection for main application
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Route to approve or reject leave requests
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

//   const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//   const updateValues = [status, requestId];

//   db.query(updateQuery, updateValues, async (error, updateResults) => {
//     if (error) {
//       console.error('Error updating leave request status:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Leave request ${action}ed successfully`);

//     const fetchQuery = 'SELECT * FROM leave_requests WHERE id = ?';
//     db.query(fetchQuery, [requestId], async (error, fetchResults) => {
//       if (error) {
//         console.error('Error fetching leave request details:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const leaveRequest = fetchResults[0];
//       const { leave_type } = leaveRequest;

//       // Update leave data
//       if (action === 'approve') {
//         // Decrement available leave and increment used leave for the approved request
//         leaveData[leave_type].available--;
//         leaveData[leave_type].used++;
//       }

//       // Update leave data in the database
//       const updateLeaveDataQuery = 'UPDATE leave_data SET available = ?, used = ? WHERE leave_type = ?';
//       const updateLeaveDataValues = [leaveData[leave_type].available, leaveData[leave_type].used, leave_type];

//       await db.query(updateLeaveDataQuery, updateLeaveDataValues);

//       // Copy leave request data to user_leave_history table
//       const insertQuery = 'INSERT INTO user_leave_history (employee_name, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//       const insertValues = [leaveRequest.employee_name, leaveRequest.start_date, leaveRequest.end_date, leaveRequest.reason, leaveRequest.status, leaveRequest.leave_type];

//       db.query(insertQuery, insertValues, (error, insertResults) => {
//         if (error) {
//           console.error('Error copying leave request to user_leave_history:', error.message);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
//         console.log('Leave request data copied to user_leave_history successfully');
//         res.status(200).json({ message: `Leave request ${action}ed successfully` });
//       });
//     });
//   });
// });



// // Route to fetch celebrations for this month
// app.get('/api/celebrations-this-month', (req, res) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
//   const currentYear = currentDate.getFullYear();

//   const query = `
//     SELECT * 
//     FROM celebrations 
//     WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
//     ORDER BY created_at DESC`; // Order by created_at column in descending order
//   db.query(query, [currentMonth, currentYear], (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });
// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations
//   const query = 'SELECT * FROM celebrations';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });


// // Route to handle celebration deletion
// app.delete('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM celebrations WHERE id = ?';
//   leavePortalDb.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} deleted successfully` });
//   });
// });



// // Route to handle PUT requests to update celebrations
// app.put('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE celebrations SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   leavePortalDb.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Socket.IO handling
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('newCelebration', (data) => {
//     const { celebration } = data;
//     const sql = 'INSERT INTO celebrations (message) VALUES (?)';
//     leavePortalDb.query(sql, [celebration], (error, result) => {
//       if (error) {
//         console.error('Error inserting celebration into database:', error);
//         return;
//       }
//       console.log('Celebration inserted into database:', result);
//       io.emit('celebrationInserted', { message: 'Celebration inserted successfully' });
//     });
//   });

//   socket.on('newAnnouncement', (announcement) => {
//     const { message } = announcement;
//     const query = 'INSERT INTO announcements (message) VALUES (?)';
//     const values = [message];
//     db.query(query, values, (error, results) => {
//       if (error) {
//         console.error('Error creating announcement:', error.message);
//         return;
//       }
//       console.log('Announcement created successfully');
//       io.emit('announcements', { id: results.insertId, message });
//     });
//   });

//   socket.on('leaveRequestStatusUpdate', async ({ requestId, status }) => {
//     try {
//       // Update leave request status in the database
//       const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//       const updateValues = [status, requestId];
//       await db.query(updateQuery, updateValues);

//       // Broadcast the updated status to all connected clients
//       io.emit('leaveRequestStatusUpdated', { requestId, status });
//     } catch (error) {
//       console.error('Error updating leave request status:', error.message);
//     }
//   });

//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return;
//     }
//     socket.emit('announcements', results);
//   });
// });

// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations and order by created_at in descending order
//   const query = 'SELECT * FROM celebrations ORDER BY created_at DESC';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });

// // Route to handle GET requests to /api/user-leave-history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT * FROM user_leave_history';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle GET requests to /api/announcements
// app.get('/api/announcements', (req, res) => {
//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle DELETE requests to /api/announcements/:id
// app.delete('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
//   db.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} deleted successfully` });
//   });
// });

// // Route to fetch pending leave requests (GET)
// app.get('/api/pending-leave-requests', (req, res) => {
//   const query = 'SELECT * FROM leave_requests WHERE status = ?';
//   db.query(query, ['pending'], (error, results) => {
//     if (error) {
//       console.error('Error fetching pending leave requests:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { employee_name, start_date, end_date, reason, leave_type } = req.body;
//   const status = 'pending';

//   const query = 'INSERT INTO leave_requests (employee_name, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [employee_name, start_date, end_date, reason, status, leave_type];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log('Leave request inserted successfully');
//     res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
//   });
// });

// // Route to handle PUT requests to /api/announcements/:id
// app.put('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE announcements SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   db.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data', (req, res) => {
//   res.json(leaveData);
// });


// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data/:userId', (req, res) => {
//   const userId = req.params.userId;
//   // Replace this with your logic to fetch leave data for the given user ID
//   // For now, I'll just send the default leaveData object
//   res.json(leaveData);
// });
// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { leave_type } = req.body;
//   leaveData[leave_type].available--;
//   leaveData[leave_type].used++;
//   res.send('Leave request approved');
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });








































// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';

// const leaveData = {
//   casual: { available: 5, used: 0 },
//   sick: { available: 10, used: 0 },
//   earned: { available: 10, used: 0 },
//   adjustment: { available: 10, used: 0 },
//   unpaid: { available: 10, used: 0 },
//   half: { available: 10, used: 0 },
// };

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // MySQL connection for leave portal
// const leavePortalDb = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// // Connect to MySQL for leave portal
// leavePortalDb.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL database for leave portal:', err);
//     return;
//   }
//   console.log('Connected to MySQL database for leave portal');
  
//   // Create celebrations table if not exists
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS celebrations (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       message TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`;
  
//   leavePortalDb.query(createTableQuery, (err, result) => {
//     if (err) {
//       console.error('Error creating celebrations table:', err);
//     } else {
//       console.log('Celebrations table created or already exists');
//     }
//   });
// });


// // MySQL connection for main application
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Route to approve or reject leave requests
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

//   const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//   const updateValues = [status, requestId];

//   db.query(updateQuery, updateValues, async (error, updateResults) => {
//     if (error) {
//       console.error('Error updating leave request status:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Leave request ${action}ed successfully`);

//     const fetchQuery = 'SELECT * FROM leave_requests WHERE id = ?';
//     db.query(fetchQuery, [requestId], async (error, fetchResults) => {
//       if (error) {
//         console.error('Error fetching leave request details:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const leaveRequest = fetchResults[0];
//       const { leave_type, userEmail } = leaveRequest;

//       // Update leave data only for the user who made the leave request
//       if (action === 'approve') {
//         // Decrement available leave and increment used leave for the approved request
//         leaveData[leave_type].available--;
//         leaveData[leave_type].used++;

//         // Update leave data in the database
//         const updateLeaveDataQuery = 'UPDATE leave_data SET available = ?, used = ? WHERE leave_type = ? AND userEmail = ?';
//         const updateLeaveDataValues = [leaveData[leave_type].available, leaveData[leave_type].used, leave_type, userEmail];
//         await db.query(updateLeaveDataQuery, updateLeaveDataValues);
//       }

//       // Copy leave request data to user_leave_history table
//       const insertQuery = 'INSERT INTO user_leave_history (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//       const insertValues = [leaveRequest.userEmail, leaveRequest.start_date, leaveRequest.end_date, leaveRequest.reason, leaveRequest.status, leaveRequest.leave_type];

//       db.query(insertQuery, insertValues, (error, insertResults) => {
//         if (error) {
//           console.error('Error copying leave request to user_leave_history:', error.message);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
//         console.log('Leave request data copied to user_leave_history successfully');
//         res.status(200).json({ message: `Leave request ${action}ed successfully` });
//       });
//     });
//   });
// });



// // Route to fetch celebrations for this month
// app.get('/api/celebrations-this-month', (req, res) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
//   const currentYear = currentDate.getFullYear();

//   const query = `
//     SELECT * 
//     FROM celebrations 
//     WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
//     ORDER BY created_at DESC`; // Order by created_at column in descending order
//   db.query(query, [currentMonth, currentYear], (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });
// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations
//   const query = 'SELECT * FROM celebrations';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });


// // Route to handle celebration deletion
// app.delete('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM celebrations WHERE id = ?';
//   leavePortalDb.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} deleted successfully` });
//   });
// });



// // Route to handle PUT requests to update celebrations
// app.put('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE celebrations SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   leavePortalDb.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Socket.IO handling
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('newCelebration', (data) => {
//     const { celebration } = data;
//     const sql = 'INSERT INTO celebrations (message) VALUES (?)';
//     leavePortalDb.query(sql, [celebration], (error, result) => {
//       if (error) {
//         console.error('Error inserting celebration into database:', error);
//         return;
//       }
//       console.log('Celebration inserted into database:', result);
//       io.emit('celebrationInserted', { message: 'Celebration inserted successfully' });
//     });
//   });

//   socket.on('newAnnouncement', (announcement) => {
//     const { message } = announcement;
//     const query = 'INSERT INTO announcements (message) VALUES (?)';
//     const values = [message];
//     db.query(query, values, (error, results) => {
//       if (error) {
//         console.error('Error creating announcement:', error.message);
//         return;
//       }
//       console.log('Announcement created successfully');
//       io.emit('announcements', { id: results.insertId, message });
//     });
//   });

//   socket.on('leaveRequestStatusUpdate', async ({ requestId, status }) => {
//     try {
//       // Update leave request status in the database
//       const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//       const updateValues = [status, requestId];
//       await db.query(updateQuery, updateValues);

//       // Broadcast the updated status to all connected clients
//       io.emit('leaveRequestStatusUpdated', { requestId, status });
//     } catch (error) {
//       console.error('Error updating leave request status:', error.message);
//     }
//   });

//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return;
//     }
//     socket.emit('announcements', results);
//   });
// });

// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations and order by created_at in descending order
//   const query = 'SELECT * FROM celebrations ORDER BY created_at DESC';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });

// // Route to handle GET requests to /api/user-leave-history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT * FROM user_leave_history';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle GET requests to /api/announcements
// app.get('/api/announcements', (req, res) => {
//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle DELETE requests to /api/announcements/:id
// app.delete('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
//   db.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} deleted successfully` });
//   });
// });

// // Route to fetch pending leave requests (GET)
// app.get('/api/pending-leave-requests', (req, res) => {
//   const query = 'SELECT * FROM leave_requests WHERE status = ?';
//   db.query(query, ['pending'], (error, results) => {
//     if (error) {
//       console.error('Error fetching pending leave requests:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { userEmail, start_date, end_date, reason, leave_type } = req.body;
//   const status = 'pending';

//   const query = 'INSERT INTO leave_requests (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [userEmail, start_date, end_date, reason, status, leave_type];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log('Leave request inserted successfully');
//     res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
//   });
// });

// // Route to handle PUT requests to /api/announcements/:id
// app.put('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE announcements SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   db.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data', (req, res) => {
//   res.json(leaveData);
// });


// // // Route to handle GET requests to /api/leave-data
// // app.get('/api/leave-data/:userId', (req, res) => {
// //   const userId = req.params.userId;
// //   // Replace this with your logic to fetch leave data for the given user ID
// //   // For now, I'll just send the default leaveData object
// //   res.json(leaveData);
// // });



// // Route to handle GET requests to /api/leave-data/:userId
// app.get('/api/leave-data/:userId', (req, res) => {
//   const userId = req.params.userId;
  
//   // Query the database to fetch leave data for the given user ID
//   const query = 'SELECT leave_type, available, used FROM user_leave_data WHERE userId = ?';
//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     if (results.length === 0) {
//       // If no leave data found for the user, return default leave data
//       return res.json(leaveData);
//     }
    
//     // Construct leaveData object based on fetched data
//     const userData = {};
//     results.forEach(row => {
//       userData[row.leave_type] = { available: row.available, used: row.used };
//     });
//     res.json(userData);
//   });
// });






// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { leave_type } = req.body;
//   leaveData[leave_type].available--;
//   leaveData[leave_type].used++;
//   res.send('Leave request approved');
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });




































// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';

// const leaveData = {
//   casual: { available: 5, used: 0 },
//   sick: { available: 10, used: 0 },
//   earned: { available: 10, used: 0 },
//   adjustment: { available: 10, used: 0 },
//   unpaid: { available: 10, used: 0 },
//   half: { available: 10, used: 0 },
// };

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // MySQL connection for leave portal
// const leavePortalDb = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// // Connect to MySQL for leave portal
// leavePortalDb.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL database for leave portal:', err);
//     return;
//   }
//   console.log('Connected to MySQL database for leave portal');
  
//   // Create celebrations table if not exists
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS celebrations (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       message TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`;
  
//   leavePortalDb.query(createTableQuery, (err, result) => {
//     if (err) {
//       console.error('Error creating celebrations table:', err);
//     } else {
//       console.log('Celebrations table created or already exists');
//     }
//   });
// });


// // MySQL connection for main application
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Route to approve or reject leave requests
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

//   const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//   const updateValues = [status, requestId];

//   db.query(updateQuery, updateValues, async (error, updateResults) => {
//     if (error) {
//       console.error('Error updating leave request status:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Leave request ${action}ed successfully`);

//     const fetchQuery = 'SELECT * FROM leave_requests WHERE id = ?';
//     db.query(fetchQuery, [requestId], async (error, fetchResults) => {
//       if (error) {
//         console.error('Error fetching leave request details:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       const leaveRequest = fetchResults[0];
//       const { leave_type, userEmail } = leaveRequest;

//       // Update leave data only for the user who made the leave request
//       if (action === 'approve') {
//         // Decrement available leave and increment used leave for the approved request
//         leaveData[leave_type].available--;
//         leaveData[leave_type].used++;

//         // Update leave data in the database
//         const updateLeaveDataQuery = 'UPDATE leave_data SET available = ?, used = ? WHERE leave_type = ? AND userEmail = ?';
//         const updateLeaveDataValues = [leaveData[leave_type].available, leaveData[leave_type].used, leave_type, userEmail];
//         await db.query(updateLeaveDataQuery, updateLeaveDataValues);
//       }

//       // Copy leave request data to user_leave_history table
//       const insertQuery = 'INSERT INTO user_leave_history (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//       const insertValues = [leaveRequest.userEmail, leaveRequest.start_date, leaveRequest.end_date, leaveRequest.reason, leaveRequest.status, leaveRequest.leave_type];

//       db.query(insertQuery, insertValues, (error, insertResults) => {
//         if (error) {
//           console.error('Error copying leave request to user_leave_history:', error.message);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
//         console.log('Leave request data copied to user_leave_history successfully');

//         // Emit event to the specific user's dashboard
//         io.emit('leaveRequestStatusUpdate', { requestId, status });
//         res.status(200).json({ message: `Leave request ${action}ed successfully` });
//       });
//     });
//   });
// });



// // Route to fetch celebrations for this month
// app.get('/api/celebrations-this-month', (req, res) => {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
//   const currentYear = currentDate.getFullYear();

//   const query = `
//     SELECT * 
//     FROM celebrations 
//     WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
//     ORDER BY created_at DESC`; // Order by created_at column in descending order
//   db.query(query, [currentMonth, currentYear], (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });
// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations
//   const query = 'SELECT * FROM celebrations';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });


// // Route to handle celebration deletion
// app.delete('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM celebrations WHERE id = ?';
//   leavePortalDb.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} deleted successfully` });
//   });
// });



// // Route to handle PUT requests to update celebrations
// app.put('/api/celebrations/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE celebrations SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   leavePortalDb.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating celebration:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Celebration with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Celebration with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Socket.IO handling
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('newCelebration', (data) => {
//     const { celebration } = data;
//     const sql = 'INSERT INTO celebrations (message) VALUES (?)';
//     leavePortalDb.query(sql, [celebration], (error, result) => {
//       if (error) {
//         console.error('Error inserting celebration into database:', error);
//         return;
//       }
//       console.log('Celebration inserted into database:', result);
//       io.emit('celebrationInserted', { message: 'Celebration inserted successfully' });
//     });
//   });

//   socket.on('newAnnouncement', (announcement) => {
//     const { message } = announcement;
//     const query = 'INSERT INTO announcements (message) VALUES (?)';
//     const values = [message];
//     db.query(query, values, (error, results) => {
//       if (error) {
//         console.error('Error creating announcement:', error.message);
//         return;
//       }
//       console.log('Announcement created successfully');
//       io.emit('announcements', { id: results.insertId, message });
//     });
//   });

//   socket.on('leaveRequestStatusUpdate', async ({ requestId, status }) => {
//     try {
//       // Update leave request status in the database
//       const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//       const updateValues = [status, requestId];
//       await db.query(updateQuery, updateValues);

//       // Broadcast the updated status to all connected clients
//       io.emit('leaveRequestStatusUpdated', { requestId, status });
//     } catch (error) {
//       console.error('Error updating leave request status:', error.message);
//     }
//   });

//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return;
//     }
//     socket.emit('announcements', results);
//   });
// });

// // Route to fetch all celebrations
// app.get('/api/celebrations', (req, res) => {
//   // Construct SQL query to select all celebrations and order by created_at in descending order
//   const query = 'SELECT * FROM celebrations ORDER BY created_at DESC';

//   // Execute the query
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching celebrations:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results); // Send celebrations as JSON response
//   });
// });

// // Route to handle GET requests to /api/user-leave-history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT * FROM user_leave_history';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle GET requests to /api/announcements
// app.get('/api/announcements', (req, res) => {
//   const query = 'SELECT * FROM announcements';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching announcements:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle DELETE requests to /api/announcements/:id
// app.delete('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;

//   const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
//   db.query(deleteQuery, [id], (error, deleteResults) => {
//     if (error) {
//       console.error('Error deleting announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} deleted successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} deleted successfully` });
//   });
// });

// // Route to fetch pending leave requests (GET)
// app.get('/api/pending-leave-requests', (req, res) => {
//   const query = 'SELECT * FROM leave_requests WHERE status = ?';
//   db.query(query, ['pending'], (error, results) => {
//     if (error) {
//       console.error('Error fetching pending leave requests:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { userEmail, start_date, end_date, reason, leave_type } = req.body;
//   const status = 'pending';

//   const query = 'INSERT INTO leave_requests (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [userEmail, start_date, end_date, reason, status, leave_type];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log('Leave request inserted successfully');
//     res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
//   });
// });

// // Route to handle PUT requests to /api/announcements/:id
// app.put('/api/announcements/:id', (req, res) => {
//   const { id } = req.params;
//   const { message } = req.body;

//   const updateQuery = 'UPDATE announcements SET message = ? WHERE id = ?';
//   const updateValues = [message, id];

//   db.query(updateQuery, updateValues, (error, updateResults) => {
//     if (error) {
//       console.error('Error updating announcement:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Announcement with ID ${id} updated successfully`);
//     res.status(200).json({ message: `Announcement with ID ${id} updated successfully`, updatedMessage: message });
//   });
// });

// // Route to handle GET requests to /api/leave-data
// app.get('/api/leave-data', (req, res) => {
//   res.json(leaveData);
// });


// // // Route to handle GET requests to /api/leave-data
// // app.get('/api/leave-data/:userId', (req, res) => {
// //   const userId = req.params.userId;
// //   // Replace this with your logic to fetch leave data for the given user ID
// //   // For now, I'll just send the default leaveData object
// //   res.json(leaveData);
// // });



// // Route to handle GET requests to /api/leave-data/:userId
// app.get('/api/leave-data/:userId', (req, res) => {
//   const userId = req.params.userId;
  
//   // Query the database to fetch leave data for the given user ID
//   const query = 'SELECT leave_type, available, used FROM user_leave_data WHERE userId = ?';
//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     if (results.length === 0) {
//       // If no leave data found for the user, return default leave data
//       return res.json(leaveData);
//     }
    
//     // Construct leaveData object based on fetched data
//     const userData = {};
//     results.forEach(row => {
//       userData[row.leave_type] = { available: row.available, used: row.used };
//     });
//     res.json(userData);
//   });
// });

// app.post('/api/leave-request/:requestId/update-status', (req, res) => {
//   const { requestId } = req.params;
//   const { status, userEmail } = req.body;

//   // Update leave request status in the leave data (replace with database update if needed)
//   // Here, assuming leaveData is an object where keys are request IDs and values contain the leave request details
//   // You would typically fetch the leave request from your database and update its status
//   if (leaveData[requestId]) {
//     leaveData[requestId].status = status;
//     // Emit leave request status update event to the client associated with the user email
//     io.to(userEmail).emit('leaveRequestStatusUpdate', { requestId, status });
//     res.status(200).send('Leave request status updated successfully');
//   } else {
//     res.status(404).send('Leave request not found');
//   }
// });

// // Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   // Sample logic to join a room based on user email
//   socket.on('userEmail', (userEmail) => {
//     console.log(`User ${userEmail} joined`);
//     socket.join(userEmail);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });




// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   const { leave_type } = req.body;
//   leaveData[leave_type].available--;
//   leaveData[leave_type].used++;
//   res.send('Leave request approved');
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

































import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';

const leaveData = {
  casual: { available: 5, used: 0 },
  sick: { available: 10, used: 0 },
  earned: { available: 10, used: 0 },
  adjustment: { available: 10, used: 0 },
  unpaid: { available: 10, used: 0 },
  half: { available: 10, used: 0 },
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection for leave portal
const leavePortalDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'leaveportal'
});

// Connect to MySQL for leave portal
leavePortalDb.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database for leave portal:', err);
    return;
  }
  console.log('Connected to MySQL database for leave portal');
  
  // Create celebrations table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS celebrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  
  leavePortalDb.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating celebrations table:', err);
    } else {
      console.log('Celebrations table created or already exists');
    }
  });
});


// MySQL connection for main application
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'leaveportal'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

// Route to approve or reject leave requests
app.post('/api/approve-reject-leave/:id', (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body;

  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';

  const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
  const updateValues = [status, requestId];

  db.query(updateQuery, updateValues, async (error, updateResults) => {
    if (error) {
      console.error('Error updating leave request status:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Leave request ${action}ed successfully`);

    const fetchQuery = 'SELECT * FROM leave_requests WHERE id = ?';
    db.query(fetchQuery, [requestId], async (error, fetchResults) => {
      if (error) {
        console.error('Error fetching leave request details:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const leaveRequest = fetchResults[0];
      const { leave_type, userEmail } = leaveRequest;

      // Update leave data only for the user who made the leave request
      if (action === 'approve') {
        // Decrement available leave and increment used leave for the approved request
        leaveData[leave_type].available--;
        leaveData[leave_type].used++;

        // Update leave data in the database
        const updateLeaveDataQuery = 'UPDATE leave_data SET available = ?, used = ? WHERE leave_type = ? AND userEmail = ?';
        const updateLeaveDataValues = [leaveData[leave_type].available, leaveData[leave_type].used, leave_type, userEmail];
        await db.query(updateLeaveDataQuery, updateLeaveDataValues);
      }

      // Copy leave request data to user_leave_history table
      const insertQuery = 'INSERT INTO user_leave_history (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
      const insertValues = [leaveRequest.userEmail, leaveRequest.start_date, leaveRequest.end_date, leaveRequest.reason, leaveRequest.status, leaveRequest.leave_type];

      db.query(insertQuery, insertValues, (error, insertResults) => {
        if (error) {
          console.error('Error copying leave request to user_leave_history:', error.message);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Leave request data copied to user_leave_history successfully');
        res.status(200).json({ message: `Leave request ${action}ed successfully` });
      });
    });
  });
});



// Route to fetch celebrations for this month
app.get('/api/celebrations-this-month', (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so adding 1
  const currentYear = currentDate.getFullYear();

  const query = `
    SELECT * 
    FROM celebrations 
    WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
    ORDER BY created_at DESC`; // Order by created_at column in descending order
  db.query(query, [currentMonth, currentYear], (error, results) => {
    if (error) {
      console.error('Error fetching celebrations:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});
// Route to fetch all celebrations
app.get('/api/celebrations', (req, res) => {
  // Construct SQL query to select all celebrations
  const query = 'SELECT * FROM celebrations';

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching celebrations:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results); // Send celebrations as JSON response
  });
});


// Route to handle celebration deletion
app.delete('/api/celebrations/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM celebrations WHERE id = ?';
  leavePortalDb.query(deleteQuery, [id], (error, deleteResults) => {
    if (error) {
      console.error('Error deleting celebration:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Celebration with ID ${id} deleted successfully`);
    res.status(200).json({ message: `Celebration with ID ${id} deleted successfully` });
  });
});



// Route to handle PUT requests to update celebrations
app.put('/api/celebrations/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const updateQuery = 'UPDATE celebrations SET message = ? WHERE id = ?';
  const updateValues = [message, id];

  leavePortalDb.query(updateQuery, updateValues, (error, updateResults) => {
    if (error) {
      console.error('Error updating celebration:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Celebration with ID ${id} updated successfully`);
    res.status(200).json({ message: `Celebration with ID ${id} updated successfully`, updatedMessage: message });
  });
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('newCelebration', (data) => {
    const { celebration } = data;
    const sql = 'INSERT INTO celebrations (message) VALUES (?)';
    leavePortalDb.query(sql, [celebration], (error, result) => {
      if (error) {
        console.error('Error inserting celebration into database:', error);
        return;
      }
      console.log('Celebration inserted into database:', result);
      io.emit('celebrationInserted', { message: 'Celebration inserted successfully' });
    });
  });

  socket.on('newAnnouncement', (announcement) => {
    const { message } = announcement;
    const query = 'INSERT INTO announcements (message) VALUES (?)';
    const values = [message];
    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error creating announcement:', error.message);
        return;
      }
      console.log('Announcement created successfully');
      io.emit('announcements', { id: results.insertId, message });
    });
  });

  socket.on('leaveRequestStatusUpdate', async ({ requestId, status }) => {
    try {
      // Update leave request status in the database
      const updateQuery = 'UPDATE leave_requests SET status = ? WHERE id = ?';
      const updateValues = [status, requestId];
      await db.query(updateQuery, updateValues);

      // Broadcast the updated status to all connected clients
      io.emit('leaveRequestStatusUpdated', { requestId, status });
    } catch (error) {
      console.error('Error updating leave request status:', error.message);
    }
  });

  const query = 'SELECT * FROM announcements';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching announcements:', error.message);
      return;
    }
    socket.emit('announcements', results);
  });
});

// Route to fetch all celebrations
app.get('/api/celebrations', (req, res) => {
  // Construct SQL query to select all celebrations and order by created_at in descending order
  const query = 'SELECT * FROM celebrations ORDER BY created_at DESC';

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching celebrations:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results); // Send celebrations as JSON response
  });
});

// Route to handle GET requests to /api/user-leave-history
app.get('/api/user-leave-history', (req, res) => {
  const query = 'SELECT * FROM user_leave_history';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching user leave history:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

// Route to handle GET requests to /api/announcements
app.get('/api/announcements', (req, res) => {
  const query = 'SELECT * FROM announcements';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching announcements:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

// Route to handle DELETE requests to /api/announcements/:id
app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM announcements WHERE id = ?';
  db.query(deleteQuery, [id], (error, deleteResults) => {
    if (error) {
      console.error('Error deleting announcement:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Announcement with ID ${id} deleted successfully`);
    res.status(200).json({ message: `Announcement with ID ${id} deleted successfully` });
  });
});

// Route to fetch pending leave requests (GET)
app.get('/api/pending-leave-requests', (req, res) => {
  const query = 'SELECT * FROM leave_requests WHERE status = ?';
  db.query(query, ['pending'], (error, results) => {
    if (error) {
      console.error('Error fetching pending leave requests:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

// Route to handle leave requests (POST)
app.post('/api/leave-request', (req, res) => {
  const { userEmail, start_date, end_date, reason, leave_type } = req.body;
  const status = 'pending';

  const query = 'INSERT INTO leave_requests (userEmail, start_date, end_date, reason, status, leave_type) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [userEmail, start_date, end_date, reason, status, leave_type];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting leave request:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Leave request inserted successfully');
    res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
  });
});

// Route to handle PUT requests to /api/announcements/:id
app.put('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  const updateQuery = 'UPDATE announcements SET message = ? WHERE id = ?';
  const updateValues = [message, id];

  db.query(updateQuery, updateValues, (error, updateResults) => {
    if (error) {
      console.error('Error updating announcement:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Announcement with ID ${id} updated successfully`);
    res.status(200).json({ message: `Announcement with ID ${id} updated successfully`, updatedMessage: message });
  });
});

// Route to handle GET requests to /api/leave-data
app.get('/api/leave-data', (req, res) => {
  res.json(leaveData);
});


// Route to handle GET requests to /api/leave-data
app.get('/api/leave-data/:userId', (req, res) => {
  const userId = req.params.userId;
  // Replace this with your logic to fetch leave data for the given user ID
  // For now, I'll just send the default leaveData object
  res.json(leaveData);
});








// Route to handle leave requests (POST)
app.post('/api/leave-request', (req, res) => {
  const { leave_type } = req.body;
  leaveData[leave_type].available--;
  leaveData[leave_type].used++;
  res.send('Leave request approved');
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

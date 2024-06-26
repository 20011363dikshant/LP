// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';
// import { approveLeaveRequest } from './models/UserSchema.js';
// import multer from 'multer';
// import fs from 'fs'; // Import the fs module to work with file system
// import path from 'path';
// import { fileURLToPath } from 'url';
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
  
//   // Execute SQL query to select all rows from the user table
//   const selectQuery = 'SELECT * FROM user';

//   db.query(selectQuery, (error, results) => {
//     if (error) {
//       console.error('Error selecting data from user table:', error);
//       // Handle the error appropriately, such as sending an error response
//     } else {
//       // Log or process the retrieved data
//       console.log('Data from user table:', results);
//       // You can send the results to the client, render them in HTML, or perform any other desired action
//     }
//   });
// });







// // Function to handle leave request approval
// async function handleLeaveApproval(userId, leave_type, userEmail, adminName) {
//   try {
//     // Update leave approval in the database
//     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
//     const updateValues = ['approved', adminName, userId, 'pending'];
//     await db.query(updateQuery, updateValues);

//     console.log('Leave request approved successfully by:', adminName);
//   } catch (error) {
//     console.error('Error handling leave approval:', error);
//   }
// }

// // Function to handle leave request rejection
// async function handleLeaveRejection(userId, leave_type, userEmail, adminName) {
//   try {
//     // Update leave rejection in the database
//     const updateQuery = 'UPDATE leaverequest SET status = ?, rejectedBy = ?, rejectedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
//     const updateValues = ['rejected', adminName, userId, 'pending'];
//     await db.query(updateQuery, updateValues);

//     console.log('Leave request rejected successfully by:', adminName);
//   } catch (error) {
//     console.error('Error handling leave rejection:', error);
//   }
// }



// // Route to handle leave request approval or rejection
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action, adminName } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

 

//     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
//     const updateValues = [status, adminName, requestId];

//     db.query(updateQuery, updateValues, async (error, updateResults) => {
//       if (error) {
//         console.error('Error updating leave request status:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       console.log(`Leave request ${action}ed successfully by ${adminName}`);

//       if (status === 'approved') {
//         const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
//         db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
//           if (fetchError) {
//             console.error('Error fetching leave request details:', fetchError.message);
//             return res.status(500).json({ error: 'Internal server error' });
//           }

//           if (fetchResults.length === 0) {
//             console.error('Leave request not found');
//             return res.status(404).json({ error: 'Leave request not found' });
//           }

//           const leaveRequest = fetchResults[0];
//           const { leave_type, userId, userEmail } = leaveRequest;

//           // Approve leave request
//           await handleLeaveApproval(userId, leave_type, userEmail, adminName);
//           // await handleLeaveRejection(userId, leave_type, userEmail, adminName);


//           // Define the columns to update based on the leave type
//           let availableColumn, usedColumn;
//           switch (leave_type) {
//             case 'casual':
//               availableColumn = 'casual_available';
//               usedColumn = 'casual_used';
//               break;
//             case 'sick':
//               availableColumn = 'sick_available';
//               usedColumn = 'sick_used';
//               break;
//             case 'earned':
//               availableColumn = 'earned_available';
//               usedColumn = 'earned_used';
//               break;
//             case 'adjustment':
//               availableColumn = 'adjustment_available';
//               usedColumn = 'adjustment_used';
//               break;
//             case 'unpaid':
//               availableColumn = 'unpaid_available';
//               usedColumn = 'unpaid_used';
//               break;
//             case 'half':
//               availableColumn = 'half_available';
//               usedColumn = 'half_used';
//               break;
//             default:
//               throw new Error('Invalid leave type');
//           }

//           // Update leave data for the user
//           const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
//           const updateLeaveDataValues = [userId];
//           await db.query(updateLeaveDataQuery, updateLeaveDataValues);

//           console.log('Leave data updated successfully for user:', userId);

//              // Get the actual available and used counts for the leave type
//         const actualLeaveData = {
//           available: leaveData[leave_type].available,
//           used: leaveData[leave_type].used
//         };

//           // Emit event to the specific user's dashboard with actual leave data
//           io.to(userEmail).emit('updateLeaveData', {
//             [leave_type]: actualLeaveData
//           });

//           res.status(200).json({ message: `Leave request ${action}ed successfully` });
//         });
//       } else {
//         res.status(200).json({ message: `Leave request ${action}ed successfully` });
//       }
//     });
//   });
// // });


























// // Route to fetch leave data for a specific user
// app.get('/api/user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch leave data for the specified user
//   const query = 'SELECT * FROM user WHERE userId = ?';

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching leave data:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       console.error('User not found');
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Extract leave data from the result
//     const userLeaveData = results[0];
//     const leaveData = {};

//     // Iterate over the result to extract available and used leave for each type
//     Object.keys(userLeaveData).forEach((key) => {
//       if (key.endsWith('_available') || key.endsWith('_used')) {
//         const leaveType = key.split('_')[0]; // Extract the leave type from the column name
//         const leaveStatus = key.endsWith('_available') ? 'available' : 'used'; // Determine if it's available or used
//         const columnName = key; // Get the column name directly

//         // Initialize the leave type object if not already present
//         if (!leaveData[leaveType]) {
//           leaveData[leaveType] = {};
//         }

//         // Assign the value to the appropriate field in the leave type object
//         leaveData[leaveType][leaveStatus] = userLeaveData[columnName];
//       }
//     });

//     res.json(leaveData);
//   });
// });


// // Route to fetch profile picture path for a specific user
// app.get('/api/user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch profile picture path for the specified user
//   const query = 'SELECT profilePicturePath FROM user WHERE userId = ?';

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching profile picture path:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Extract the profile picture path from the query results
//     const profilePicturePath = results[0].profilePicturePath;
//     return res.json({ profilePicturePath });
//   });
// });




// // Route to fetch user leave history
// app.get('/api/employee-leave-history', (req, res) => {
//   const query = 'SELECT  start_date , end_date , userEmail AS email, reason,status, approvedBy FROM leaverequest';
//   // const pic = 'SELECT profilePicturePath FROM user '
// // const qer='Select name FROM user'
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });


// // Route to fetch user leave history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT start_date, end_date, userEmail, reason, status FROM leaverequest';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
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

//   // Send leave data to the newly connected client
//   socket.emit('leaveDataUpdated', leaveData);

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


  

// // Event listener for leave request status update
// socket.on('leaveRequestStatusUpdate', async ({ requestId, status, userId }) => {
//   try {
//     // Update leave request status in the database
//     const updateQuery = 'UPDATE leaverequest SET status = ? WHERE id = ? AND userId = ?';
//     const updateValues = [status, requestId, userId];
//     const updateResults = await db.query(updateQuery, updateValues);

//     if (updateResults.affectedRows === 0) {
//       // If no rows were affected by the update (possibly due to unauthorized access), return a 404 error
//       return socket.emit('leaveRequestStatusUpdated', { error: 'Leave request not found or unauthorized' });
//     }

//     // Emit the updated status only to the specific user's dashboard
//     io.to(userId).emit('leaveRequestStatusUpdated', { requestId, status });

//     if (status === 'approved') {
//       // Placeholder for updating leave data
//       // Placeholder for emitting events to update dashboard components
//     }
//   } catch (error) {
//     console.error('Error updating leave request status:', error.message);
//     socket.emit('leaveRequestStatusUpdated', { error: 'Internal server error' });
//   }


// });
// });





// // Route to handle PATCH requests to update leave request
// app.patch('/api/leave-request/:userId', (req, res) => {
//   const userId = req.params.userId; // Extract userID from the request parameters
//   const { start_date, end_date, reason, leave_type, status, userEmail } = req.body;

//   console.log('Received userId:', userId); // Log the userId extracted from request parameters
//   console.log('Request Body:', req.body); // Log the request body

//   // Check if all required fields are present in the request body
//   if (!start_date || !end_date || !reason || !leave_type || !status || !userEmail || !userId) {
//     return res.status(400).json({ error: 'Missing required fields in request body' });
//   }

//   const insertQuery = 'INSERT INTO leaverequest (start_date, end_date, reason, leave_type, status, userEmail, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   const values = [start_date, end_date, reason, leave_type, status, userEmail, userId];

//   console.log('Insert Query:', insertQuery); // Log the insert query
//   console.log('Values:', values); // Log the values being inserted

//   db.query(insertQuery, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log('Leave request inserted successfully');
//     res.status(201).json({ message: 'Leave request inserted successfully', id: results.insertId });
//   });
// });







// // Route to fetch pending leave requests
// app.get('/api/pending-leave-requests', (req, res) => {
//   try {
//     const query = 'SELECT userEmail,id, leave_type, userId, DATE(start_date) as start_date, DATE(end_date) as end_date, reason, status FROM leaverequest WHERE status = ?';
//     db.query(query, ['pending'], (error, results) => {
//       if (error) {
//         console.error('Error fetching pending leave requests:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       res.status(200).json(results);
//     });
//   } catch (error) {
//     console.error('Error in /api/pending-leave-requests:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
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
// app.get('/api/user-leave-data/:userId', (req, res) => {
//   res.json(leaveData);
// });

// // Route to fetch leave data for a specific user
// app.get('/api/user-leave-data', (req, res) => {
//   const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user

//   // Fetch leave data from the database for the authenticated user
//   const query = 'SELECT * FROM user_leave_data WHERE userId = ?';
//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// app.put('/api/user-leave-data', (req, res) => {
//   const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
//   const { leaveType, available, used } = req.body;

//   // Update or insert leave data for the authenticated user
//   const updateQuery = `
//     INSERT INTO user_leave_data (userId, leaveType, available, used) 
//     VALUES (?, ?, ?, ?) 
//     ON DUPLICATE KEY UPDATE available = VALUES(available), used = VALUES(used)`;
//   const updateValues = [userId, leaveType, available, used];

//   db.query(updateQuery, updateValues, (error, result) => {
//     if (error) {
//       console.error('Error updating user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json({ message: 'Leave data updated successfully' });
//   });
// });



// // Route to fetch all users with role 'employee'
// app.get('/api/users', (req, res) => {
//   // const query = 'SELECT * FROM user WHERE role = ?'; // Assuming your table name is 'user' and role column is 'role'
//   const query = `SELECT profilePicturePath,gender,id, name, email, employeeID, number, role, dob, start_date, end_date, reason, status, leave_type, leave_status, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used FROM user WHERE role = ?;`;

//   const role = 'employee'; // Specify the role you want to filter by
//   db.query(query, [role], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Update an employee record in the database based on email
// app.put('/api/users/:email', (req, res) => {
//   const email = req.params.email;
//   const updatedEmployee = req.body;

//   db.query('UPDATE user SET ? WHERE email = ?', [updatedEmployee, email], (err, result) => {
//     if (err) {
//       console.error('Error updating employee data:', err);
//       res.status(500).json({ error: 'Error updating employee data' });
//     } else {
//       console.log('Employee data updated successfully');
//       res.status(200).json({ message: 'Employee data updated successfully' });
//     }
//   });
// });


// // Delete an employee record from the database based on email
// app.delete('/api/users/:email', (req, res) => {
//   const email = req.params.email;

//   db.query('DELETE FROM user WHERE email = ?', email, (err, result) => {
//     if (err) {
//       console.error('Error deleting employee data:', err);
//       res.status(500).json({ error: 'Error deleting employee data' });
//     } else {
//       console.log('Employee data deleted successfully');
//       res.status(200).json({ message: 'Employee data deleted successfully' });
//     }
//   });
// });







// // // Multer configuration
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     const uploadDir = './public/images/';
// //     fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
// //     cb(null, uploadDir); // Destination folder for uploads in backend
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Filename for the uploaded file
// //   }
// // });

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/'); // Destination folder for uploads in backend
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Filename for the uploaded file
//   }
// });


// const upload = multer({ storage: storage });


// // Get the directory name using import.meta.url
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);




// // Serve static files (including profile pictures)
// app.use(express.static(path.join(__dirname, 'public')));



// // // Define a route to serve profile pictures
// // app.get('/api/profile-picture/email', (req, res) => {
// //   const userId = req.params.userId;

// //   // Query the database to get the profile picture path for the user
// //   db.query('SELECT profilePicturePath FROM user WHERE userId = ?', [userId], (error, results) => {
// //     if (error) {
// //       console.error('Error retrieving profile picture path:', error);
// //       res.status(500).json({ error: 'Internal server error' });
// //     } else if (results.length === 0) {
// //       res.status(404).json({ error: 'User not found' });
// //     } else {
// //       const profilePicturePath = results[0].profile_picture_path;
// //       if (profilePicturePath) {
// //         // Construct the full URL to the profile picture
// //         const profilePictureUrl = `http://${req.headers.host}/profile-pictures/${profilePicturePath}`;
// //         // Redirect to the profile picture URL
// //         res.redirect(profilePictureUrl);
// //       } else {
// //         res.status(404).json({ error: 'Profile picture not found' });
// //       }
// //     }
// //   });
// // });
// // // // Route to handle profile picture upload
// // // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// // //   try {
// // //     // Retrieve the file path of the uploaded profile picture
// // //     const profilePicturePath = req.file.path;
    
// // //     // Update the profile picture path in the database for the user
// // //     const userId = req.body.userId; // Assuming the user ID is sent in the request body
// // //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// // //     db.query(updateQuery, [profilePicturePath, userId], (error, results) => {
// // //       if (error) {
// // //         console.error('Error updating profile picture path in database:', error);
// // //         return res.status(500).json({ error: 'Internal server error' });
// // //       }
// // //       console.log('Profile picture uploaded and database updated successfully');
// // //       res.status(200).json({ message: 'Profile picture uploaded successfully' });
// // //     });
// // //   } catch (error) {
// // //     console.error('Error uploading profile picture:', error);
// // //     res.status(500).json({ error: 'Internal server error' });
// // //   }
// // // });
// // Define a route to serve profile pictures
// app.get('/api/profile-picture/:email', (req, res) => {
//   const email = req.params.email;

//   // Query the database to get the profile picture path for the user
//   db.query('SELECT profilePicturePath FROM user WHERE email = ?', [email], (error, results) => {
//     if (error) {
//       console.error('Error retrieving profile picture path:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     } else if (results.length === 0) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       const profilePicturePath = results[0].profilePicturePath;
//       if (profilePicturePath) {
//         // Construct the full URL to the profile picture
//         const profilePictureUrl = `http://${req.headers.host}/profile-pictures/${profilePicturePath}`;
//         // Send the profile picture URL in the response
//         res.json({ profilePictureUrl });
//       } else {
//         res.status(404).json({ error: 'Profile picture not found' });
//       }
//     }
//   });
// });

// // // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;
    
// //     // Update the profile picture path in the database for the user
// //     const email = req.body.email; // Assuming the email is sent in the request body
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE email = ?';
// //     db.query(updateQuery, [profilePicturePath, email], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');
// //       res.status(200).json({ message: 'Profile picture uploaded successfully' });
// //     });
// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;
    
// //     // Retrieve the user ID from the request body
// //     const userId = req.body.userId;

// //     // Update the profile picture path in the database for the user
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// //     db.query(updateQuery, [profilePicturePath, userId], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');
// //       res.status(200).json({ message: 'Profile picture uploaded successfully' });
// //     });
// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });



// // // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;

// //     // Retrieve the user ID from the request body
// //     const userId = req.body.userId;

// //     // Update the profile picture path in the database for the user
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// //     db.query(updateQuery, [profilePicturePath, userId], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');
      
// //       // Send back the updated profile picture path in the response
// //       res.status(200).json({ 
// //         message: 'Profile picture uploaded successfully',
// //         profilePicturePath: profilePicturePath
// //       });
// //     });
// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;

// //     // Retrieve the user ID from the request body
// //     const userId = req.body.userId;

// //     // Update the profile picture path in the database for the user
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// //     db.query(updateQuery, [profilePicturePath, userId], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');

// //       // Send back the updated profile picture path in the response
// //       res.status(200).json({
// //         message: 'Profile picture uploaded successfully',
// //         profilePicturePath: profilePicturePath
// //       });
// //     });

// //     // Move the uploaded file to the public/Images directory
// //     const oldPath = profilePicturePath;
// //     const newPath = path.join(__dirname, 'public', 'Images', `${userId}_${req.file.originalname}`);
// //     fs.renameSync(oldPath, newPath);

// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });


// // // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;

// //     // Retrieve the user ID from the request body
// //     const userId = req.body.userId;

// //     // Extract the filename from the full path
// //     const filename = path.basename(profilePicturePath);

// //     // Update the profile picture path in the database for the user
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// //     db.query(updateQuery, [filename, userId], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');

// //       // Send back the updated profile picture path in the response
// //       res.status(200).json({
// //         message: 'Profile picture uploaded successfully',
// //         profilePicturePath: filename
// //       });
// //     });

// //     // Move the uploaded file to the public/Images directory
// //     const newPath = path.join(__dirname, 'public', 'Images', filename);
// //     fs.renameSync(profilePicturePath, newPath);

// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });



// // // Route to handle profile picture upload
// // app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
// //   try {
// //     // Retrieve the file path of the uploaded profile picture
// //     const profilePicturePath = req.file.path;

// //     // Retrieve the user ID from the request body
// //     const userId = req.body.userId;

// //     // Extract the filename from the full path
// //     const filename = path.basename(profilePicturePath);

// //     // Update the profile picture path in the database for the user
// //     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
// //     db.query(updateQuery, [filename, userId], (error, results) => {
// //       if (error) {
// //         console.error('Error updating profile picture path in database:', error);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }
// //       console.log('Profile picture uploaded and database updated successfully');

// //       // Send back the updated profile picture path in the response
// //       res.status(200).json({
// //         message: 'Profile picture uploaded successfully',
// //         profilePicturePath: filename
// //       });

// //       // Move the uploaded file to the public/Images directory
// //       const newPath = path.join(__dirname, 'public', 'Images', filename);
// //       fs.copyFileSync(profilePicturePath, newPath);
// //     });

// //   } catch (error) {
// //     console.error('Error uploading profile picture:', error);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });
// // Route to handle profile picture upload
// app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
//   try {
//     // Retrieve the file path of the uploaded profile picture
//     const profilePicturePath = req.file.path;

//     // Retrieve the user ID from the request body
//     const userId = req.body.userId;

//     // Extract the filename from the full path
//     const filename = path.basename(profilePicturePath);

//     // Update the profile picture path in the database for the user
//     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
//     db.query(updateQuery, [filename, userId], (error, results) => {
//       if (error) {
//         console.error('Error updating profile picture path in database:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       console.log('Profile picture uploaded and database updated successfully');

//       // Move the uploaded file to the public/images directory in the backend folder
//       if (profilePicturePath) {
//         const oldPath = profilePicturePath;
//         const newPathBackend = path.join(__dirname, 'public', 'images', filename);
//         fs.renameSync(oldPath, newPathBackend); // Move to backend folder

//         // Copy the uploaded file to the public/Images directory in the frontend folder
//         const newPathFrontend = path.join(__dirname, '..', 'leaveportal', 'public', 'Images', filename);
//         fs.copyFileSync(newPathBackend, newPathFrontend); // Copy to frontend folder
//       }

//       // Send back the updated profile picture path in the response
//       res.status(200).json({
//         message: 'Profile picture uploaded successfully',
//         profilePicturePath: filename
//       });
//     });

//   } catch (error) {
//     console.error('Error uploading profile picture:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
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
// import { approveLeaveRequest } from './models/UserSchema.js';
// import multer from 'multer';
// import fs from 'fs'; // Import the fs module to work with file system
// import path from 'path';
// import { fileURLToPath } from 'url';
// // import '@fortawesome/fontawesome-free/css/all.min.css';



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
  
//   // Execute SQL query to select all rows from the user table
//   const selectQuery = 'SELECT * FROM user';

//   db.query(selectQuery, (error, results) => {
//     if (error) {
//       console.error('Error selecting data from user table:', error);
//       // Handle the error appropriately, such as sending an error response
//     } else {
//       // Log or process the retrieved data
//       console.log('Data from user table:', results);
//       // You can send the results to the client, render them in HTML, or perform any other desired action
//     }
//   });
// });







// // // Function to handle leave request approval
// // async function handleLeaveApproval(userId, leave_type, userEmail, adminName) {
// //   try {
// //     // Update leave approval in the database
// //     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
// //     const updateValues = ['approved', adminName, userId, 'pending'];
// //     await db.query(updateQuery, updateValues);

// //     console.log('Leave request approved successfully by:', adminName);
// //   } catch (error) {
// //     console.error('Error handling leave approval:', error);
// //   }
// // }

// // // Function to handle leave request rejection
// // async function handleLeaveRejection(userId, leave_type, userEmail, adminName) {
// //   try {
// //     // Update leave rejection in the database
// //     const updateQuery = 'UPDATE leaverequest SET status = ?, rejectedBy = ?, rejectedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
// //     const updateValues = ['rejected', adminName, userId, 'pending'];
// //     await db.query(updateQuery, updateValues);

// //     console.log('Leave request rejected successfully by:', adminName);
// //   } catch (error) {
// //     console.error('Error handling leave rejection:', error);
// //   }
// // }



// // // Route to handle leave request approval or rejection
// // app.post('/api/approve-reject-leave/:id', (req, res) => {
// //   const requestId = req.params.id;
// //   const { action, adminName } = req.body;

// //   if (action !== 'approve' && action !== 'reject') {
// //     return res.status(400).json({ error: 'Invalid action' });
// //   }

// //   const status = action === 'approve' ? 'approved' : 'rejected';

 

// //     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
// //     const updateValues = [status, adminName, requestId];

// //     db.query(updateQuery, updateValues, async (error, updateResults) => {
// //       if (error) {
// //         console.error('Error updating leave request status:', error.message);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       console.log(`Leave request ${action}ed successfully by ${adminName}`);

// //       if (status === 'approved') {
// //         const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
// //         db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
// //           if (fetchError) {
// //             console.error('Error fetching leave request details:', fetchError.message);
// //             return res.status(500).json({ error: 'Internal server error' });
// //           }

// //           if (fetchResults.length === 0) {
// //             console.error('Leave request not found');
// //             return res.status(404).json({ error: 'Leave request not found' });
// //           }

// //           const leaveRequest = fetchResults[0];
// //           const { leave_type, userId, userEmail } = leaveRequest;

// //           // Approve leave request
// //           await handleLeaveApproval(userId, leave_type, userEmail, adminName);
// //           // await handleLeaveRejection(userId, leave_type, userEmail, adminName);


// //           // Define the columns to update based on the leave type
// //           let availableColumn, usedColumn;
// //           switch (leave_type) {
// //             case 'casual':
// //               availableColumn = 'casual_available';
// //               usedColumn = 'casual_used';
// //               break;
// //             case 'sick':
// //               availableColumn = 'sick_available';
// //               usedColumn = 'sick_used';
// //               break;
// //             case 'earned':
// //               availableColumn = 'earned_available';
// //               usedColumn = 'earned_used';
// //               break;
// //             case 'adjustment':
// //               availableColumn = 'adjustment_available';
// //               usedColumn = 'adjustment_used';
// //               break;
// //             case 'unpaid':
// //               availableColumn = 'unpaid_available';
// //               usedColumn = 'unpaid_used';
// //               break;
// //             case 'half':
// //               availableColumn = 'half_available';
// //               usedColumn = 'half_used';
// //               break;
// //             default:
// //               throw new Error('Invalid leave type');
// //           }

// //           // Update leave data for the user
// //           const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
// //           const updateLeaveDataValues = [userId];
// //           await db.query(updateLeaveDataQuery, updateLeaveDataValues);

// //           console.log('Leave data updated successfully for user:', userId);

// //              // Get the actual available and used counts for the leave type
// //         const actualLeaveData = {
// //           available: leaveData[leave_type].available,
// //           used: leaveData[leave_type].used
// //         };

// //           // Emit event to the specific user's dashboard with actual leave data
// //           io.to(userEmail).emit('updateLeaveData', {
// //             [leave_type]: actualLeaveData
// //           });

// //           res.status(200).json({ message: `Leave request ${action}ed successfully` });
// //         });
// //       } else {
// //         res.status(200).json({ message: `Leave request ${action}ed successfully` });
// //       }
// //     });
// //   });






// // // Function to handle leave request approval
// // async function handleLeaveApproval(userId, leave_type, userEmail, adminName) {
// //   try {
// //     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
// //     const updateValues = ['approved', adminName, userId, 'pending'];
// //     await db.query(updateQuery, updateValues);

// //     const insertNotificationQuery = 'INSERT INTO notifications (userId, message, is_read, created_at) VALUES (?, ?, ?, NOW())';
// //     const notificationMessage = `Your  ${leave_type} Leave has been approved by ${adminName}`;
// //     await db.query(insertNotificationQuery, [userId, notificationMessage, false]);

// //     io.to(userEmail).emit('leaveApproved', { message: notificationMessage });

// //     console.log('Leave request approved successfully by:', adminName);
// //   } catch (error) {
// //     console.error('Error handling leave approval:', error);
// //   }
// // }

// // app.post('/api/approve-reject-leave/:id', (req, res) => {
// //   const requestId = req.params.id;
// //   const { action, adminName } = req.body;

// //   if (action !== 'approve' && action !== 'reject') {
// //     return res.status(400).json({ error: 'Invalid action' });
// //   }

// //   const status = action === 'approve' ? 'approved' : 'rejected';

// //   const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
// //   const updateValues = [status, adminName, requestId];

// //   db.query(updateQuery, updateValues, async (error, updateResults) => {
// //     if (error) {
// //       console.error('Error updating leave request status:', error.message);
// //       return res.status(500).json({ error: 'Internal server error' });
// //     }

// //     console.log(`Leave request ${action}ed successfully by ${adminName}`);

// //     if (status === 'approved') {
// //       const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
// //       db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
// //         if (fetchError) {
// //           console.error('Error fetching leave request details:', fetchError.message);
// //           return res.status(500).json({ error: 'Internal server error' });
// //         }

// //         if (fetchResults.length === 0) {
// //           console.error('Leave request not found');
// //           return res.status(404).json({ error: 'Leave request not found' });
// //         }

// //         const leaveRequest = fetchResults[0];
// //         const { leave_type, userId, userEmail } = leaveRequest;

// //         await handleLeaveApproval(userId, leave_type, userEmail, adminName);

// //         // Define the columns to update based on the leave type
// //         let availableColumn, usedColumn;
// //         switch (leave_type) {
// //           case 'casual':
// //             availableColumn = 'casual_available';
// //             usedColumn = 'casual_used';
// //             break;
// //           case 'sick':
// //             availableColumn = 'sick_available';
// //             usedColumn = 'sick_used';
// //             break;
// //           case 'earned':
// //             availableColumn = 'earned_available';
// //             usedColumn = 'earned_used';
// //             break;
// //           case 'adjustment':
// //             availableColumn = 'adjustment_available';
// //             usedColumn = 'adjustment_used';
// //             break;
// //           case 'unpaid':
// //             availableColumn = 'unpaid_available';
// //             usedColumn = 'unpaid_used';
// //             break;
// //           case 'half':
// //             availableColumn = 'half_available';
// //             usedColumn = 'half_used';
// //             break;
// //           default:
// //             throw new Error('Invalid leave type');
// //         }

// //         const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
// //         const updateLeaveDataValues = [userId];
// //         await db.query(updateLeaveDataQuery, updateLeaveDataValues);

// //         console.log('Leave data updated successfully for user:', userId);

// //         const actualLeaveData = {
// //           available: leaveData[leave_type].available,
// //           used: leaveData[leave_type].used
// //         };

// //         io.to(userEmail).emit('updateLeaveData', {
// //           [leave_type]: actualLeaveData
// //         });

// //         res.status(200).json({ message: `Leave request ${action}ed successfully` });
// //       });
// //     } else {
// //       res.status(200).json({ message: `Leave request ${action}ed successfully` });
// //     }
// //   });
// // });



// // // // Route to fetch notifications for a specific user
// // // app.get('/api/notifications/:userId', (req, res) => {
// // //   const userId = req.params.userId;
// // //   const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
// // //   db.query(query, [userId], (error, results) => {
// // //     if (error) {
// // //       console.error('Error fetching notifications:', error.message);
// // //       return res.status(500).json({ error: 'Internal server error' });
// // //     }
// // //     res.status(200).json(results);
// // //   });
// // // });


// // Route to fetch notifications for a specific user
// app.get('/api/notifications/:userId', (req, res) => {
//   const userId = req.params.userId;
//   const query = 'SELECT * FROM notifications WHERE userId = ? ORDER BY created_at DESC';
//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching notifications:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });



// // // Function to handle leave request approval or rejection
// // async function handleLeavehandleLeaveApproval(userId, leave_type, userEmail, adminName, action) {
// //   try {
// //     const status = action === 'approve' ? 'approved' : 'rejected';
// //     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
// //     const updateValues = [status, adminName, userId, 'pending'];
// //     await db.query(updateQuery, updateValues);

// //     const insertNotificationQuery = 'INSERT INTO notifications (userId,status, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())';
// //     const notificationMessage = `Your ${leave_type} Leave has been ${status} by ${adminName}`;
// //     await db.query(insertNotificationQuery, [userId, notificationMessage, false]);

// //     const event = status === 'approved' ? 'leaveApproved' : 'leaveRejected';
// //     io.to(userEmail).emit(event, { message: notificationMessage });

// //     console.log(`Leave request ${status} successfully by: ${adminName}`);
// //   } catch (error) {
// //     console.error(`Error handling leave ${status}:`, error);
// //   }
// // }

// // app.post('/api/approve-reject-leave/:id', (req, res) => {
// //   const requestId = req.params.id;
// //   const { action, adminName } = req.body;

// //   if (action !== 'approve' && action !== 'reject') {
// //     return res.status(400).json({ error: 'Invalid action' });
// //   }

// //   const status = action === 'approve' ? 'approved' : 'rejected';

// //   const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
// //   const updateValues = [status, adminName, requestId];

// //   db.query(updateQuery, updateValues, async (error, updateResults) => {
// //     if (error) {
// //       console.error('Error updating leave request status:', error.message);
// //       return res.status(500).json({ error: 'Internal server error' });
// //     }

// //     console.log(`Leave request ${action}ed successfully by ${adminName}`);

// //     const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
// //     db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
// //       if (fetchError) {
// //         console.error('Error fetching leave request details:', fetchError.message);
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       if (fetchResults.length === 0) {
// //         console.error('Leave request not found');
// //         return res.status(404).json({ error: 'Leave request not found' });
// //       }

// //       const leaveRequest = fetchResults[0];
// //       const { leave_type, userId, userEmail } = leaveRequest;

// //       await handleLeavehandleLeaveApproval(userId, leave_type, userEmail, adminName, action);

// //       if (status === 'approved') {
// //         // Define the columns to update based on the leave type
// //         let availableColumn, usedColumn;
// //         switch (leave_type) {
// //           case 'casual':
// //             availableColumn = 'casual_available';
// //             usedColumn = 'casual_used';
// //             break;
// //           case 'sick':
// //             availableColumn = 'sick_available';
// //             usedColumn = 'sick_used';
// //             break;
// //           case 'earned':
// //             availableColumn = 'earned_available';
// //             usedColumn = 'earned_used';
// //             break;
// //           case 'adjustment':
// //             availableColumn = 'adjustment_available';
// //             usedColumn = 'adjustment_used';
// //             break;
// //           case 'unpaid':
// //             availableColumn = 'unpaid_available';
// //             usedColumn = 'unpaid_used';
// //             break;
// //           case 'half':
// //             availableColumn = 'half_available';
// //             usedColumn = 'half_used';
// //             break;
// //           default:
// //             throw new Error('Invalid leave type');
// //         }

// //         const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
// //         const updateLeaveDataValues = [userId];
// //         await db.query(updateLeaveDataQuery, updateLeaveDataValues);

// //         console.log('Leave data updated successfully for user:', userId);

// //         const actualLeaveData = {
// //           available: leaveData[leave_type].available,
// //           used: leaveData[leave_type].used
// //         };

// //         io.to(userEmail).emit('updateLeaveData', {
// //           [leave_type]: actualLeaveData
// //         });
// //       }

// //       res.status(200).json({ message: `Leave request ${action}ed successfully` });
// //     });
// //   });
// // });


// // Function to handle leave request approval or rejection
// async function handleLeaveApproval(userId, leave_type, userEmail, adminName, action) {
//   try {
//     const status = action === 'approve' ? 'approved' : 'rejected';
//     const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
//     const updateValues = [status, adminName, userId, 'pending'];
//     await db.query(updateQuery, updateValues);

//     const insertNotificationQuery = 'INSERT INTO notifications (userId, status, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())';
//     const notificationMessage = `Your ${leave_type} Leave has been ${status} by ${adminName}`;
//     await db.query(insertNotificationQuery, [userId, status, notificationMessage, false]);

//     const event = status === 'approved' ? 'leaveApproved' : 'leaveRejected';
//     io.to(userEmail).emit(event, { message: notificationMessage });

//     console.log(`Leave request ${status} successfully by: ${adminName}`);
//   } catch (error) {
//     console.error(`Error handling leave ${status}:`, error);
//   }
// }

// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action, adminName } = req.body;

//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   const status = action === 'approve' ? 'approved' : 'rejected';

//   const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
//   const updateValues = [status, adminName, requestId];

//   db.query(updateQuery, updateValues, async (error, updateResults) => {
//     if (error) {
//       console.error('Error updating leave request status:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log(`Leave request ${action}ed successfully by ${adminName}`);

//     const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
//     db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
//       if (fetchError) {
//         console.error('Error fetching leave request details:', fetchError.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       if (fetchResults.length === 0) {
//         console.error('Leave request not found');
//         return res.status(404).json({ error: 'Leave request not found' });
//       }

//       const leaveRequest = fetchResults[0];
//       const { leave_type, userId, userEmail } = leaveRequest;

//       await handleLeaveApproval(userId, leave_type, userEmail, adminName, action);

//       if (status === 'approved') {
//         let availableColumn, usedColumn;
//         switch (leave_type) {
//           case 'casual':
//             availableColumn = 'casual_available';
//             usedColumn = 'casual_used';
//             break;
//           case 'sick':
//             availableColumn = 'sick_available';
//             usedColumn = 'sick_used';
//             break;
//           case 'earned':
//             availableColumn = 'earned_available';
//             usedColumn = 'earned_used';
//             break;
//           case 'adjustment':
//             availableColumn = 'adjustment_available';
//             usedColumn = 'adjustment_used';
//             break;
//           case 'unpaid':
//             availableColumn = 'unpaid_available';
//             usedColumn = 'unpaid_used';
//             break;
//           case 'half':
//             availableColumn = 'half_available';
//             usedColumn = 'half_used';
//             break;
//           default:
//             throw new Error('Invalid leave type');
//         }

//         const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
//         const updateLeaveDataValues = [userId];
//         await db.query(updateLeaveDataQuery, updateLeaveDataValues);

//         console.log('Leave data updated successfully for user:', userId);

//         const actualLeaveData = {
//           available: leaveData[leave_type].available,
//           used: leaveData[leave_type].used
//         };

//         io.to(userEmail).emit('updateLeaveData', {
//           [leave_type]: actualLeaveData
//         });
//       }

//       res.status(200).json({ message: `Leave request ${action}ed successfully` });
//     });
//   });
// });





















// // Route to fetch leave data for a specific user
// app.get('/api/user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch leave data for the specified user
//   const query = 'SELECT * FROM user WHERE userId = ?';

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching leave data:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       console.error('User not found');
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Extract leave data from the result
//     const userLeaveData = results[0];
//     const leaveData = {};

//     // Iterate over the result to extract available and used leave for each type
//     Object.keys(userLeaveData).forEach((key) => {
//       if (key.endsWith('_available') || key.endsWith('_used')) {
//         const leaveType = key.split('_')[0]; // Extract the leave type from the column name
//         const leaveStatus = key.endsWith('_available') ? 'available' : 'used'; // Determine if it's available or used
//         const columnName = key; // Get the column name directly

//         // Initialize the leave type object if not already present
//         if (!leaveData[leaveType]) {
//           leaveData[leaveType] = {};
//         }

//         // Assign the value to the appropriate field in the leave type object
//         leaveData[leaveType][leaveStatus] = userLeaveData[columnName];
//       }
//     });

//     res.json(leaveData);
//   });
// });


// // Route to fetch profile picture path for a specific user
// app.get('/api/user/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch profile picture path for the specified user
//   const query = 'SELECT profilePicturePath FROM user WHERE userId = ?';

//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching profile picture path:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Extract the profile picture path from the query results
//     const profilePicturePath = results[0].profilePicturePath;
//     return res.json({ profilePicturePath });
//   });
// });




// // Route to fetch user leave history
// app.get('/api/employee-leave-history', (req, res) => {
//   const query = 'SELECT  start_date , end_date , userEmail AS email, reason,status, approvedBy FROM leaverequest';
//   // const pic = 'SELECT profilePicturePath FROM user '
// // const qer='Select name FROM user'
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });


// // Route to fetch user leave history
// app.get('/api/user-leave-history', (req, res) => {
//   const query = 'SELECT start_date, end_date, userEmail, reason, status FROM leaverequest';
//   db.query(query, (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave history:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
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

//   // Send leave data to the newly connected client
//   socket.emit('leaveDataUpdated', leaveData);

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


  

// // Event listener for leave request status update
// socket.on('leaveRequestStatusUpdate', async ({ requestId, status, userId }) => {
//   try {
//     // Update leave request status in the database
//     const updateQuery = 'UPDATE leaverequest SET status = ? WHERE id = ? AND userId = ?';
//     const updateValues = [status, requestId, userId];
//     const updateResults = await db.query(updateQuery, updateValues);

//     if (updateResults.affectedRows === 0) {
//       // If no rows were affected by the update (possibly due to unauthorized access), return a 404 error
//       return socket.emit('leaveRequestStatusUpdated', { error: 'Leave request not found or unauthorized' });
//     }

//     // Emit the updated status only to the specific user's dashboard
//     io.to(userId).emit('leaveRequestStatusUpdated', { requestId, status });

//     if (status === 'approved') {
//       // Placeholder for updating leave data
//       // Placeholder for emitting events to update dashboard components
//     }
//   } catch (error) {
//     console.error('Error updating leave request status:', error.message);
//     socket.emit('leaveRequestStatusUpdated', { error: 'Internal server error' });
//   }


// });
// });





// // Route to handle PATCH requests to update leave request
// app.patch('/api/leave-request/:userId', (req, res) => {
//   const userId = req.params.userId; // Extract userID from the request parameters
//   const { start_date, end_date, reason, leave_type, status, userEmail } = req.body;

//   console.log('Received userId:', userId); // Log the userId extracted from request parameters
//   console.log('Request Body:', req.body); // Log the request body

//   // Check if all required fields are present in the request body
//   if (!start_date || !end_date || !reason || !leave_type || !status || !userEmail || !userId) {
//     return res.status(400).json({ error: 'Missing required fields in request body' });
//   }

//   const insertQuery = 'INSERT INTO leaverequest (start_date, end_date, reason, leave_type, status, userEmail, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
//   const values = [start_date, end_date, reason, leave_type, status, userEmail, userId];

//   console.log('Insert Query:', insertQuery); // Log the insert query
//   console.log('Values:', values); // Log the values being inserted

//   db.query(insertQuery, values, (error, results) => {
//     if (error) {
//       console.error('Error inserting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     console.log('Leave request inserted successfully');
//     res.status(201).json({ message: 'Leave request inserted successfully', id: results.insertId });
//   });
// });







// // Route to fetch pending leave requests
// app.get('/api/pending-leave-requests', (req, res) => {
//   try {
//     const query = 'SELECT userEmail,id, leave_type, userId, DATE(start_date) as start_date, DATE(end_date) as end_date, reason, status FROM leaverequest WHERE status = ?';
//     db.query(query, ['pending'], (error, results) => {
//       if (error) {
//         console.error('Error fetching pending leave requests:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       res.status(200).json(results);
//     });
//   } catch (error) {
//     console.error('Error in /api/pending-leave-requests:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
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
// app.get('/api/user-leave-data/:userId', (req, res) => {
//   res.json(leaveData);
// });

// // Route to fetch leave data for a specific user
// app.get('/api/user-leave-data', (req, res) => {
//   const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user

//   // Fetch leave data from the database for the authenticated user
//   const query = 'SELECT * FROM user_leave_data WHERE userId = ?';
//   db.query(query, [userId], (error, results) => {
//     if (error) {
//       console.error('Error fetching user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// app.put('/api/user-leave-data', (req, res) => {
//   const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
//   const { leaveType, available, used } = req.body;

//   // Update or insert leave data for the authenticated user
//   const updateQuery = `
//     INSERT INTO user_leave_data (userId, leaveType, available, used) 
//     VALUES (?, ?, ?, ?) 
//     ON DUPLICATE KEY UPDATE available = VALUES(available), used = VALUES(used)`;
//   const updateValues = [userId, leaveType, available, used];

//   db.query(updateQuery, updateValues, (error, result) => {
//     if (error) {
//       console.error('Error updating user leave data:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json({ message: 'Leave data updated successfully' });
//   });
// });



// // Route to fetch all users with role 'employee'
// app.get('/api/users', (req, res) => {
//   // const query = 'SELECT * FROM user WHERE role = ?'; // Assuming your table name is 'user' and role column is 'role'
//   const query = `SELECT profilePicturePath,gender,id, name, email, employeeID, number, role, dob, start_date, end_date, reason, status, leave_type, leave_status, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used FROM user WHERE role = ?;`;

//   const role = 'employee'; // Specify the role you want to filter by
//   db.query(query, [role], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Update an employee record in the database based on email
// app.put('/api/users/:email', (req, res) => {
//   const email = req.params.email;
//   const updatedEmployee = req.body;

//   db.query('UPDATE user SET ? WHERE email = ?', [updatedEmployee, email], (err, result) => {
//     if (err) {
//       console.error('Error updating employee data:', err);
//       res.status(500).json({ error: 'Error updating employee data' });
//     } else {
//       console.log('Employee data updated successfully');
//       res.status(200).json({ message: 'Employee data updated successfully' });
//     }
//   });
// });


// // Delete an employee record from the database based on email
// app.delete('/api/users/:email', (req, res) => {
//   const email = req.params.email;

//   db.query('DELETE FROM user WHERE email = ?', email, (err, result) => {
//     if (err) {
//       console.error('Error deleting employee data:', err);
//       res.status(500).json({ error: 'Error deleting employee data' });
//     } else {
//       console.log('Employee data deleted successfully');
//       res.status(200).json({ message: 'Employee data deleted successfully' });
//     }
//   });
// });






// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/'); // Destination folder for uploads in backend
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Filename for the uploaded file
//   }
// });


// const upload = multer({ storage: storage });


// // Get the directory name using import.meta.url
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);




// // Serve static files (including profile pictures)
// app.use(express.static(path.join(__dirname, 'public')));



// // Define a route to serve profile pictures
// app.get('/api/profile-picture/:email', (req, res) => {
//   const email = req.params.email;

//   // Query the database to get the profile picture path for the user
//   db.query('SELECT profilePicturePath FROM user WHERE email = ?', [email], (error, results) => {
//     if (error) {
//       console.error('Error retrieving profile picture path:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     } else if (results.length === 0) {
//       res.status(404).json({ error: 'User not found' });
//     } else {
//       const profilePicturePath = results[0].profilePicturePath;
//       if (profilePicturePath) {
//         // Construct the full URL to the profile picture
//         const profilePictureUrl = `http://${req.headers.host}/profile-pictures/${profilePicturePath}`;
//         // Send the profile picture URL in the response
//         res.json({ profilePictureUrl });
//       } else {
//         res.status(404).json({ error: 'Profile picture not found' });
//       }
//     }
//   });
// });



// app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
//   try {
//     // Retrieve the file path of the uploaded profile picture
//     const profilePicturePath = req.file.path;

//     // Retrieve the user ID from the request body
//     const userId = req.body.userId;

//     // Extract the filename from the full path
//     const filename = path.basename(profilePicturePath);

//     // Update the profile picture path in the database for the user
//     const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
//     db.query(updateQuery, [filename, userId], (error, results) => {
//       if (error) {
//         console.error('Error updating profile picture path in database:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       console.log('Profile picture uploaded and database updated successfully');

//       // Move the uploaded file to the public/images directory in the backend folder
//       if (profilePicturePath) {
//         const oldPath = profilePicturePath;
//         const newPathBackend = path.join(__dirname, 'public', 'images', filename);
//         fs.renameSync(oldPath, newPathBackend); // Move to backend folder

//         // Copy the uploaded file to the public/Images directory in the frontend folder
//         const newPathFrontend = path.join(__dirname, '..', 'leaveportal', 'public', 'Images', filename);
//         fs.copyFileSync(newPathBackend, newPathFrontend); // Copy to frontend folder
//       }

//       // Send back the updated profile picture path in the response
//       res.status(200).json({
//         message: 'Profile picture uploaded successfully',
//         profilePicturePath: filename
//       });
//     });

//   } catch (error) {
//     console.error('Error uploading profile picture:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
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
import { approveLeaveRequest } from './models/UserSchema.js';
import multer from 'multer';
import fs from 'fs'; // Import the fs module to work with file system
import path from 'path';
import { fileURLToPath } from 'url';
// import '@fortawesome/fontawesome-free/css/all.min.css';



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
  
  // Execute SQL query to select all rows from the user table
  const selectQuery = 'SELECT * FROM user';

  db.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error selecting data from user table:', error);
      // Handle the error appropriately, such as sending an error response
    } else {
      // Log or process the retrieved data
      console.log('Data from user table:', results);
      // You can send the results to the client, render them in HTML, or perform any other desired action
    }
  });
});







// Route to fetch notifications for a specific user
app.get('/api/notifications/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM notifications WHERE userId = ? ORDER BY created_at DESC';
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching notifications:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});



// Function to handle leave request approval or rejection
async function handleLeaveApproval(userId, leave_type, userEmail, adminName, action) {
  try {
    const status = action === 'approve' ? 'approved' : 'rejected';
    const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ?, approvedAt = CURRENT_TIMESTAMP WHERE userId = ? AND status = ?';
    const updateValues = [status, adminName, userId, 'pending'];
    await db.query(updateQuery, updateValues);

    const insertNotificationQuery = 'INSERT INTO notifications (userId, status, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())';
    const notificationMessage = `Your ${leave_type} Leave has been ${status} by ${adminName}`;
    await db.query(insertNotificationQuery, [userId, status, notificationMessage, false]);

    

    const event = status === 'approved' ? 'leaveApproved' : 'leaveRejected';
    io.to(userEmail).emit(event, { message: notificationMessage });

    console.log(`Leave request ${status} successfully by: ${adminName}`);
  } catch (error) {
    console.error(`Error handling leave ${status}:`, error);
  }
}

app.post('/api/approve-reject-leave/:id', (req, res) => {
  const requestId = req.params.id;
  const { action, adminName } = req.body;

  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';

  const updateQuery = 'UPDATE leaverequest SET status = ?, approvedBy = ? WHERE id = ?';
  const updateValues = [status, adminName, requestId];

  db.query(updateQuery, updateValues, async (error, updateResults) => {
    if (error) {
      console.error('Error updating leave request status:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(`Leave request ${action}ed successfully by ${adminName}`);

    const fetchQuery = 'SELECT leave_type, userId, userEmail FROM leaverequest WHERE id = ?';
    db.query(fetchQuery, [requestId], async (fetchError, fetchResults) => {
      if (fetchError) {
        console.error('Error fetching leave request details:', fetchError.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (fetchResults.length === 0) {
        console.error('Leave request not found');
        return res.status(404).json({ error: 'Leave request not found' });
      }

      const leaveRequest = fetchResults[0];
      const { leave_type, userId, userEmail } = leaveRequest;

      await handleLeaveApproval(userId, leave_type, userEmail, adminName, action);

      if (status === 'approved') {
        let availableColumn, usedColumn;
        switch (leave_type) {
          case 'casual':
            availableColumn = 'casual_available';
            usedColumn = 'casual_used';
            break;
          case 'sick':
            availableColumn = 'sick_available';
            usedColumn = 'sick_used';
            break;
          case 'earned':
            availableColumn = 'earned_available';
            usedColumn = 'earned_used';
            break;
          case 'adjustment':
            availableColumn = 'adjustment_available';
            usedColumn = 'adjustment_used';
            break;
          case 'unpaid':
            availableColumn = 'unpaid_available';
            usedColumn = 'unpaid_used';
            break;
          case 'half':
            availableColumn = 'half_available';
            usedColumn = 'half_used';
            break;
          default:
            throw new Error('Invalid leave type');
        }

        const updateLeaveDataQuery = `UPDATE user SET ${availableColumn} = ${availableColumn} - 1, ${usedColumn} = ${usedColumn} + 1 WHERE userId = ?`;
        const updateLeaveDataValues = [userId];
        await db.query(updateLeaveDataQuery, updateLeaveDataValues);

        console.log('Leave data updated successfully for user:', userId);

        const actualLeaveData = {
          available: leaveData[leave_type].available,
          used: leaveData[leave_type].used
        };

        io.to(userEmail).emit('updateLeaveData', {
          [leave_type]: actualLeaveData
        });
      }

      res.status(200).json({ message: `Leave request ${action}ed successfully` });
    });
  });
});



// Route to fetch notifications for a specific user
app.get('/api/pendingnotifications', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM leaverequest  ';
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching notifications:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});




















// Route to fetch leave data for a specific user
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query to fetch leave data for the specified user
  const query = 'SELECT * FROM user WHERE userId = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching leave data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract leave data from the result
    const userLeaveData = results[0];
    const leaveData = {};

    // Iterate over the result to extract available and used leave for each type
    Object.keys(userLeaveData).forEach((key) => {
      if (key.endsWith('_available') || key.endsWith('_used')) {
        const leaveType = key.split('_')[0]; // Extract the leave type from the column name
        const leaveStatus = key.endsWith('_available') ? 'available' : 'used'; // Determine if it's available or used
        const columnName = key; // Get the column name directly

        // Initialize the leave type object if not already present
        if (!leaveData[leaveType]) {
          leaveData[leaveType] = {};
        }

        // Assign the value to the appropriate field in the leave type object
        leaveData[leaveType][leaveStatus] = userLeaveData[columnName];
      }
    });

    res.json(leaveData);
  });
});


// Route to fetch profile picture path for a specific user
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query to fetch profile picture path for the specified user
  const query = 'SELECT profilePicturePath FROM user WHERE userId = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching profile picture path:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract the profile picture path from the query results
    const profilePicturePath = results[0].profilePicturePath;
    return res.json({ profilePicturePath });
  });
});




// Route to fetch user leave history
app.get('/api/employee-leave-history', (req, res) => {
  const query = 'SELECT  start_date , end_date , userEmail AS email, reason,status, approvedBy FROM leaverequest';
  // const pic = 'SELECT profilePicturePath FROM user '
// const qer='Select name FROM user'
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching user leave history:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});


// Route to fetch user leave history
app.get('/api/user-leave-history', (req, res) => {
  const query = 'SELECT start_date, end_date, userEmail, reason, status FROM leaverequest';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching user leave history:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
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

  // Send leave data to the newly connected client
  socket.emit('leaveDataUpdated', leaveData);

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


  

// Event listener for leave request status update
socket.on('leaveRequestStatusUpdate', async ({ requestId, status, userId }) => {
  try {
    // Update leave request status in the database
    const updateQuery = 'UPDATE leaverequest SET status = ? WHERE id = ? AND userId = ?';
    const updateValues = [status, requestId, userId];
    const updateResults = await db.query(updateQuery, updateValues);

    if (updateResults.affectedRows === 0) {
      // If no rows were affected by the update (possibly due to unauthorized access), return a 404 error
      return socket.emit('leaveRequestStatusUpdated', { error: 'Leave request not found or unauthorized' });
    }

    // Emit the updated status only to the specific user's dashboard
    io.to(userId).emit('leaveRequestStatusUpdated', { requestId, status });

    if (status === 'approved') {
      // Placeholder for updating leave data
      // Placeholder for emitting events to update dashboard components
    }
  } catch (error) {
    console.error('Error updating leave request status:', error.message);
    socket.emit('leaveRequestStatusUpdated', { error: 'Internal server error' });
  }


});
});





// Route to handle PATCH requests to update leave request
app.patch('/api/leave-request/:userId', (req, res) => {
  const userId = req.params.userId; // Extract userID from the request parameters
  const { start_date, end_date, reason, leave_type, status, userEmail } = req.body;

  console.log('Received userId:', userId); // Log the userId extracted from request parameters
  console.log('Request Body:', req.body); // Log the request body

  // Check if all required fields are present in the request body
  if (!start_date || !end_date || !reason || !leave_type || !status || !userEmail || !userId) {
    return res.status(400).json({ error: 'Missing required fields in request body' });
  }

  const insertQuery = 'INSERT INTO leaverequest (start_date, end_date, reason, leave_type, status, userEmail, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [start_date, end_date, reason, leave_type, status, userEmail, userId];

  console.log('Insert Query:', insertQuery); // Log the insert query
  console.log('Values:', values); // Log the values being inserted

  db.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error('Error inserting leave request:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Leave request inserted successfully');
    res.status(201).json({ message: 'Leave request inserted successfully', id: results.insertId });
  });
});







// Route to fetch pending leave requests
app.get('/api/pending-leave-requests', (req, res) => {
  try {
    const query = 'SELECT userEmail,id, leave_type, userId, DATE(start_date) as start_date, DATE(end_date) as end_date, reason, status FROM leaverequest WHERE status = ?';
    db.query(query, ['pending'], (error, results) => {
      if (error) {
        console.error('Error fetching pending leave requests:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error in /api/pending-leave-requests:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to fetch pending leave requests
app.get('/api/pending-notification', (req, res) => {
  try {
    const query = 'SELECT userEmail FROM leaverequest WHERE status = ?';
    db.query(query, ['pending'], (error, results) => {
      if (error) {
        console.error('Error fetching pending leave requests:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error in /api/pending-notification', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// // Route to fetch pending leave requests
// app.get('/api/leave-requests/pendingnotification', (req, res) => {
//   try {
//     const query = 'SELECT userEmail,id, leave_type, userId, DATE(start_date) as start_date, DATE(end_date) as end_date, reason, status FROM leaverequest WHERE status = ?';
//     db.query(query, ['pending'], (error, results) => {
//       if (error) {
//         console.error('Error fetching pending leave requests:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       res.status(200).json(results);
//     });
//   } catch (error) {
//     console.error('Error in /api/pending-leave-requests:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });








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
app.get('/api/user-leave-data/:userId', (req, res) => {
  res.json(leaveData);
});

// Route to fetch leave data for a specific user
app.get('/api/user-leave-data', (req, res) => {
  const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user

  // Fetch leave data from the database for the authenticated user
  const query = 'SELECT * FROM user_leave_data WHERE userId = ?';
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user leave data:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

app.put('/api/user-leave-data', (req, res) => {
  const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
  const { leaveType, available, used } = req.body;

  // Update or insert leave data for the authenticated user
  const updateQuery = `
    INSERT INTO user_leave_data (userId, leaveType, available, used) 
    VALUES (?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE available = VALUES(available), used = VALUES(used)`;
  const updateValues = [userId, leaveType, available, used];

  db.query(updateQuery, updateValues, (error, result) => {
    if (error) {
      console.error('Error updating user leave data:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ message: 'Leave data updated successfully' });
  });
});



// Route to fetch all users with role 'employee'
app.get('/api/users', (req, res) => {
  // const query = 'SELECT * FROM user WHERE role = ?'; // Assuming your table name is 'user' and role column is 'role'
  const query = `SELECT profilePicturePath,gender,id, name, email, employeeID, number, role, dob, start_date, end_date, reason, status, leave_type, leave_status, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used FROM user WHERE role = ?;`;

  const role = 'employee'; // Specify the role you want to filter by
  db.query(query, [role], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Update an employee record in the database based on email
app.put('/api/users/:email', (req, res) => {
  const email = req.params.email;
  const updatedEmployee = req.body;

  db.query('UPDATE user SET ? WHERE email = ?', [updatedEmployee, email], (err, result) => {
    if (err) {
      console.error('Error updating employee data:', err);
      res.status(500).json({ error: 'Error updating employee data' });
    } else {
      console.log('Employee data updated successfully');
      res.status(200).json({ message: 'Employee data updated successfully' });
    }
  });
});


// Delete an employee record from the database based on email
app.delete('/api/users/:email', (req, res) => {
  const email = req.params.email;

  db.query('DELETE FROM user WHERE email = ?', email, (err, result) => {
    if (err) {
      console.error('Error deleting employee data:', err);
      res.status(500).json({ error: 'Error deleting employee data' });
    } else {
      console.log('Employee data deleted successfully');
      res.status(200).json({ message: 'Employee data deleted successfully' });
    }
  });
});






// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/'); // Destination folder for uploads in backend
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Filename for the uploaded file
  }
});


const upload = multer({ storage: storage });


// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Serve static files (including profile pictures)
app.use(express.static(path.join(__dirname, 'public')));



// Define a route to serve profile pictures
app.get('/api/profile-picture/:email', (req, res) => {
  const email = req.params.email;

  // Query the database to get the profile picture path for the user
  db.query('SELECT profilePicturePath FROM user WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error retrieving profile picture path:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const profilePicturePath = results[0].profilePicturePath;
      if (profilePicturePath) {
        // Construct the full URL to the profile picture
        const profilePictureUrl = `http://${req.headers.host}/profile-pictures/${profilePicturePath}`;
        // Send the profile picture URL in the response
        res.json({ profilePictureUrl });
      } else {
        res.status(404).json({ error: 'Profile picture not found' });
      }
    }
  });
});



app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
  try {
    // Retrieve the file path of the uploaded profile picture
    const profilePicturePath = req.file.path;

    // Retrieve the user ID from the request body
    const userId = req.body.userId;

    // Extract the filename from the full path
    const filename = path.basename(profilePicturePath);

    // Update the profile picture path in the database for the user
    const updateQuery = 'UPDATE user SET profilePicturePath = ? WHERE userId = ?';
    db.query(updateQuery, [filename, userId], (error, results) => {
      if (error) {
        console.error('Error updating profile picture path in database:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Profile picture uploaded and database updated successfully');

      // Move the uploaded file to the public/images directory in the backend folder
      if (profilePicturePath) {
        const oldPath = profilePicturePath;
        const newPathBackend = path.join(__dirname, 'public', 'images', filename);
        fs.renameSync(oldPath, newPathBackend); // Move to backend folder

        // Copy the uploaded file to the public/Images directory in the frontend folder
        const newPathFrontend = path.join(__dirname, '..', 'leaveportal', 'public', 'Images', filename);
        fs.copyFileSync(newPathBackend, newPathFrontend); // Copy to frontend folder
      }

      // Send back the updated profile picture path in the response
      res.status(200).json({
        message: 'Profile picture uploaded successfully',
        profilePicturePath: filename
      });
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mysql from 'mysql';

// const app = express();
// const PORT = 4000;

// // Create MySQL connection
// const con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// // Function to handle MySQL connection errors
// con.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// app.use(cors());
// app.use(bodyParser.json());

// // Route to fetch pending leave requests
// app.get('/api/pending-leave-requests', (req, res) => {
//   // Placeholder logic to fetch pending leave requests from the database
//   con.query('SELECT * FROM leave_requests WHERE status = ?', ['pending'], (error, results) => {
//     if (error) {
//       console.error('Error fetching pending leave requests:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.status(200).json(results);
//   });
// });

// // Route to handle leave requests (POST)
// app.post('/api/leave-request', (req, res) => {
//   // Placeholder logic to handle incoming leave requests and store them in the database
//   const { employee_name, start_date, end_date, reason } = req.body;
//   const status = 'pending';

//   con.query('INSERT INTO leave_requests (employee_name, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)',
//     [employee_name, start_date, end_date, reason, status], (error, results) => {
//       if (error) {
//         console.error('Error handling leave request:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       res.status(200).json({ message: 'Leave request received successfully', id: results.insertId });
//     });
// });

// // Route to approve or reject leave requests
// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body; // Action can be 'approve' or 'reject'

//   // Validate action
//   if (action !== 'approve' && action !== 'reject') {
//     return res.status(400).json({ error: 'Invalid action' });
//   }

//   // Update status based on action
//   const status = action === 'approve' ? 'approved' : 'rejected';

//   // Update leave request status in the database
//   const query = 'UPDATE leave_requests SET status = ? WHERE id = ?';
//   const values = [status, requestId];

//   con.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Error approving/rejecting leave request:', error.message);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     console.log(`Leave request ${action}ed successfully`);
//     res.status(200).json({ message: `Leave request ${action}ed successfully` });
//   });
// });

// // Ensure that the server is running and listening on port 4000
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

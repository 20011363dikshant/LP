// import express from 'express';
// import con from '../utils/db.js'; // Adjust the path as per your directory structure

// const router = express.Router();

// // Route to handle leave approval or rejection
// router.post('/:id', (req, res) => {
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

// export default router;


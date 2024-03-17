// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';

// const app = express();
// const PORT = 4000;

// app.use(cors());
// app.use(bodyParser.json());

// let pendingLeaveRequests = [];

// const generateId = () => {
//   return Math.random().toString(36).substr(2, 9);
// };

// app.get('/', (req, res) => {
//   res.send('Welcome to the Leave Portal API');
// });

// app.get('/api/pending-leave-requests', (req, res) => {
//   res.json(pendingLeaveRequests);
// });

// app.post('/api/approve-reject-leave/:id', (req, res) => {
//   const requestId = req.params.id;
//   const { action } = req.body;

//   const leaveRequest = pendingLeaveRequests.find(request => request.id === requestId);

//   if (!leaveRequest) {
//     return res.status(404).json({ error: 'Leave request not found' });
//   }

//   leaveRequest.status = action === 'approve' ? 'approved' : 'rejected';

//   res.status(200).json({ message: `${action}ed leave request with ID ${requestId}` });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

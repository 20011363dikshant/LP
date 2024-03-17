import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'leaveportal'
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

// Route to handle leave approval or rejection
app.post('/api/approve-reject-leave/:id', (req, res) => {
  const requestId = req.params.id;
  const { action } = req.body; // Action can be 'approve' or 'reject'

  // Validate action
  if (action !== 'approve' && action !== 'reject') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  // Update status based on action
  const status = action === 'approve' ? 'approved' : 'rejected';

  // Update leave request status in the database
  const query = 'UPDATE leave_requests SET status = ? WHERE id = ?';
  const values = [status, requestId];

  con.query(query, values, (error, results) => {
    if (error) {
      console.error('Error approving/rejecting leave request:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(`Leave request ${action}ed successfully`);
    res.status(200).json({ message: `Leave request ${action}ed successfully` });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});












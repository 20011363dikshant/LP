// const express = require('express');
// const bodyParser = require('body-parser');

// const leaveData = {
//   casual: { available: 5, used: 0 },
//   sick: { available: 10, used: 0 },
//   earned: { available: 10, used: 0 },
//   adjustment: { available: 10, used: 0 },
//   unpaid: { available: 10, used: 0 },
//   half: { available: 10, used: 0 },
// };

// const app = express();
// app.use(bodyParser.json());

// app.get('/api/leave-data', (req, res) => {
//   res.json(leaveData);
// });

// app.post('/api/leave-request', (req, res) => {
//   const { leave_type } = req.body;
//   leaveData[leave_type].available--;
//   leaveData[leave_type].used++;
//   res.send('Leave request approved');
// });

// app.listen(4000, () => {
//   console.log('Server is running on port 4000');
// });
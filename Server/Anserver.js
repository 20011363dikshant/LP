// // Anserver.js
// import express from 'express';
// import bodyParser from 'body-parser';

// const app = express();
// const port = 5000;

// app.use(bodyParser.json());

// let announcement = "";

// app.get('/api/announcement', (req, res) => {
//   res.json({ announcement });
// });

// app.post('/api/announcement', (req, res) => {
//   announcement = req.body.announcement;
//   res.json({ message: 'Announcement submitted successfully' });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

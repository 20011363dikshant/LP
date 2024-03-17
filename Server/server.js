// import express from 'express';
// import mysql from 'mysql2/promise';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; // Import JWT module

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // JWT secret key
// const JWT_SECRET_KEY = 'your_secret_key_here';

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, employeeID, number, password, role, dob } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//   try {
//     const connection = await pool.getConnection();
//     await connection.query('INSERT INTO Login (name, email, employeeID, number, password, role, dob) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, employeeID, number, hashedPassword, role, dob]);
//     connection.release();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Check email endpoint
// app.post('/auth/check-email', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       res.json({ exists: true });
//     } else {
//       res.json({ exists: false });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch && user.role === role) {
//         // Generate JWT token
//         const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour

//         // Send token back to the client
//         res.json({ loginStatus: true, role, token });
//       } else {
//         res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update password endpoint
// app.put('/auth/update-password', async (req, res) => {
//   const { email, oldPassword, newPassword } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(oldPassword, user.password);
//       if (passwordMatch) {
//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         await connection.query('UPDATE Login SET password = ? WHERE email = ?', [hashedNewPassword, email]);
//         res.status(200).json({ message: 'Password updated successfully' });
//       } else {
//         res.status(401).json({ error: 'Invalid old password' });
//       }
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Route to handle GET requests for leave data based on user role or ID
// app.get('/api/leave-data/:role/:id', (req, res) => {
//   const { role, id } = req.params;
  
//   // Use role and/or id to fetch leave data dynamically from the database
//   // Example query: SELECT * FROM leave_data WHERE user_id = ? AND role = ?
  
//   // Dummy response for demonstration
//   const leaveData = {
//     casual: { available: 5, used: 0 },
//     sick: { available: 10, used: 0 },
//     earned: { available: 10, used: 0 },
//     adjustment: { available: 10, used: 0 },
//     unpaid: { available: 10, used: 0 },
//     half: { available: 10, used: 0 }
//   };

//   res.json(leaveData);
// });

// // Route to handle GET requests for celebrations this month based on user role or ID
// app.get('/api/celebrations-this-month/:role/:id', (req, res) => {
//   const { role, id } = req.params;

//   // Use role and/or id to fetch celebrations dynamically from the database
//   // Example query: SELECT * FROM celebrations WHERE user_id = ? AND role = ? AND MONTH(created_at) = ? AND YEAR(created_at) = ?
  
//   // Dummy response for demonstration
//   const celebrations = [
//     { id: 1, message: 'Celebration 1' },
//     { id: 2, message: 'Celebration 2' },
//     { id: 3, message: 'Celebration 3' }
//   ];

//   res.json(celebrations);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

































// import express from 'express';
// import mysql from 'mysql2/promise';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; // Import JWT module
// import { UserSchema, checkEmailExists } from './models/UserSchema.js';
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // JWT secret key
// const JWT_SECRET_KEY = 'your_secret_key_here';

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, employeeID, number, password, role, dob } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//   try {
//     const connection = await pool.getConnection();
//     await connection.query('INSERT INTO Login (name, email, employeeID, number, password, role, dob) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, employeeID, number, hashedPassword, role, dob]);
//     connection.release();

//     const user = new UserSchema({
//       name,
//       email,
//       employeeID,
//       number,
//       password: hashedPassword,
//       role,
//       dob,
//       // Add userId and leave details here
//       userId: generateUserId(), // You need to implement a function to generate userId
//       leave: {
//         casual: { available: 5, used: 0 },
//         sick: { available: 10, used: 0 },
//         earned: { available: 10, used: 0 },
//         adjustment: { available: 10, used: 0 },
//         unpaid: { available: 10, used: 0 },
//         half: { available: 10, used: 0 }
//       }
//     });
    
//     // Save the user details in the database
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Check email endpoint
// app.post('/auth/check-email', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       res.json({ exists: true });
//     } else {
//       res.json({ exists: false });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch && user.role === role) {
//         // Generate JWT token
//         const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour

//         // Send token back to the client
//         res.json({ loginStatus: true, role, token });
//       } else {
//         res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update password endpoint
// app.put('/auth/update-password', async (req, res) => {
//   const { email, oldPassword, newPassword } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM Login WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(oldPassword, user.password);
//       if (passwordMatch) {
//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         await connection.query('UPDATE Login SET password = ? WHERE email = ?', [hashedNewPassword, email]);
//         res.status(200).json({ message: 'Password updated successfully' });
//       } else {
//         res.status(401).json({ error: 'Invalid old password' });
//       }
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Route to handle GET requests for leave data based on user role or ID
// app.get('/api/leave-data/:role/:id', (req, res) => {
//   const { role, id } = req.params;
  
//   // Use role and/or id to fetch leave data dynamically from the database
//   // Example query: SELECT * FROM leave_data WHERE user_id = ? AND role = ?
  
//   // Dummy response for demonstration
//   const leaveData = {
//     casual: { available: 5, used: 0 },
//     sick: { available: 10, used: 0 },
//     earned: { available: 10, used: 0 },
//     adjustment: { available: 10, used: 0 },
//     unpaid: { available: 10, used: 0 },
//     half: { available: 10, used: 0 }
//   };

//   res.json(leaveData);
// });

// // Route to handle GET requests for celebrations this month based on user role or ID
// app.get('/api/celebrations-this-month/:role/:id', (req, res) => {
//   const { role, id } = req.params;

//   // Use role and/or id to fetch celebrations dynamically from the database
//   // Example query: SELECT * FROM celebrations WHERE user_id = ? AND role = ? AND MONTH(created_at) = ? AND YEAR(created_at) = ?
  
//   // Dummy response for demonstration
//   const celebrations = [
//     { id: 1, message: 'Celebration 1' },
//     { id: 2, message: 'Celebration 2' },
//     { id: 3, message: 'Celebration 3' }
//   ];

//   res.json(celebrations);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });































// import express from 'express';
// import mysql from 'mysql2/promise';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { createUser, checkEmailExists } from './models/UserSchema.js';
// import { v4 as uuidv4 } from 'uuid';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const JWT_SECRET_KEY = 'your_secret_key_here';

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// function generateUserId() {
//   return uuidv4();
// }

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, employeeID, number, password, role, dob } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//   try {
//     // Generate a unique userId
//     const userId = generateUserId();

//     // Check if email already exists
//     const emailExists = await checkEmailExists(email);
//     if (emailExists.exists) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Insert the new user into the database
//     await createUser(name, email, employeeID, number, hashedPassword, role, dob, userId);

//     // Fetch the newly created user data from the database
//     const user = await getUserByEmail(email);

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// // Function to fetch user data by email
// async function getUserByEmail(email) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();
//     return rows[0];
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error;
//   }
// }

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch && user.role === role) {
//         const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
//         res.json({ loginStatus: true, role, token });
//       } else {
//         res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update password endpoint
// app.put('/auth/update-password', async (req, res) => {
//   const { email, oldPassword, newPassword } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(oldPassword, user.password);
//       if (passwordMatch) {
//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//         await connection.query('UPDATE User SET password = ? WHERE email = ?', [hashedNewPassword, email]);
//         res.status(200).json({ message: 'Password updated successfully' });
//       } else {
//         res.status(401).json({ error: 'Invalid old password' });
//       }
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Check email endpoint
// app.post('/auth/check-email', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const emailExists = await checkEmailExists(email);
//     res.json({ exists: emailExists.exists });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Route to handle GET requests for leave data based on user role or ID
// app.get('/api/leave-data/:role/:id', (req, res) => {
//   const { role, id } = req.params;
//   // Handle GET requests for leave data
// });

// // Route to handle GET requests for celebrations this month based on user role or ID
// app.get('/api/celebrations-this-month/:role/:id', (req, res) => {
//   const { role, id } = req.params;
//   // Handle GET requests for celebrations
// });



// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
















// import express from 'express';
// import mysql from 'mysql2/promise';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { createUser, checkEmailExists } from './models/UserSchema.js';
// import { v4 as uuidv4 } from 'uuid';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const JWT_SECRET_KEY = 'your_secret_key_here';

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Define endpoint to check if email exists
// app.post('/auth/check-email', async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if email already exists in the database
//     const emailExists = await checkEmailExists(email);
//     res.json({ exists: emailExists.exists });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, employeeID, number, password, role, dob } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//   try {
//     // Generate a unique userId
//     const userId = generateUserId();

//     // Check if email already exists
//     const emailExists = await checkEmailExists(email);
//     if (emailExists.exists) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Insert the new user into the database
//     await createUser(name, email, employeeID, number, hashedPassword, role, dob, userId);

//     // Fetch the newly created user data from the database
//     const user = await getUserByEmail(email);

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Function to generate a unique userId
// function generateUserId() {
//   return uuidv4();
// }

// // Function to fetch user data by email
// async function getUserByEmail(email) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();
//     return rows[0];
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error;
//   }
// }

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {
//         // Generate JWT token
//         const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
//         res.json({ loginStatus: true, role: user.role, token });
//       } else {
//         res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Fetching Employee and Admin by their user id
// app.get('/dashboard', authenticateToken, async (req, res) => {
//   const userEmail = req.user.email;
//   try {
//     const user = await getUserByEmail(userEmail);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     if (user.role === 'employee') {
//       // Fetch employee-specific dashboard data based on the user's ID
//       const dashboardData = await fetchEmployeeDashboardData(user.userId);
//       res.json({ message: 'Employee Dashboard', data: dashboardData });
//     } else if (user.role === 'admin') {
//       // Fetch manager-specific dashboard data based on the user's ID
//       const dashboardData = await fetchManagerDashboardData(user.userId);
//       res.json({ message: 'Manager Dashboard', data: dashboardData });
//     } else {
//       res.status(403).json({ error: 'Unauthorized' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// // Route to fetch leave status for a user by email
// app.get('/api/leave-status/:email', async (req, res) => {
//   const userEmail = req.params.email;

//   try {
//     const leaveStatus = await getLeaveStatus(userEmail);
//     res.json({ leaveStatus });
//   } catch (error) {
//     console.error('Error fetching leave status:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Function to query the database and get the leave status for the user with the given email
// async function getLeaveStatus(userEmail) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT leave_status FROM leave_requests WHERE email = ?', [userEmail]);
//     connection.release();
//     return rows.length > 0 ? rows[0].leave_status : 'No leave status found';
//   } catch (error) {
//     console.error('Error fetching leave status from database:', error);
//     throw error;
//   }
// }

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // Function to fetch employee-specific dashboard data based on the user's ID
// async function fetchEmployeeDashboardData(userId) {
//   try {
//     const connection = await pool.getConnection();
  
//     const [rows] = await connection.query('SELECT * FROM User WHERE userId = ? AND role = ?', [userId, 'employee']);
//     connection.release();
//     return rows; 
//   } catch (error) {
//     console.error('Error fetching employee dashboard data:', error);
//     throw error;
//   }
// }

// // Function to fetch manager-specific dashboard data based on the user's ID
// async function fetchManagerDashboardData(userId) {
//   try {
//     const connection = await pool.getConnection();
  
//     const [rows] = await connection.query('SELECT * FROM User WHERE userId = ? AND role = ?', [userId, 'admin']);
//     connection.release();
//     return rows; 
//   } catch (error) {
//     console.error('Error fetching manager dashboard data:', error);
//     throw error;
//   }
// }
























// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import mysql from 'mysql2/promise';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { createUser, checkEmailExists } from './models/UserSchema.js';
// import { v4 as uuidv4 } from 'uuid';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const JWT_SECRET_KEY = 'your_secret_key_here';

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// // Define endpoint to check if email exists
// app.post('/auth/check-email', async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if email already exists in the database
//     const emailExists = await checkEmailExists(email);
//     res.json({ exists: emailExists.exists });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, employeeID, number, password, role, dob } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//   try {
//     // Generate a unique userId
//     const userId = generateUserId();

//     // Check if email already exists
//     const emailExists = await checkEmailExists(email);
//     if (emailExists.exists) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Insert the new user into the database
//     await createUser(name, email, employeeID, number, hashedPassword, role, dob, userId);

//     // Fetch the newly created user data from the database
//     const user = await getUserByEmail(email);

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Function to generate a unique userId
// function generateUserId() {
//   return uuidv4();
// }

// // Function to fetch user data by email
// async function getUserByEmail(email) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();
//     return rows[0];
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error;
//   }
// }

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
//     connection.release();

//     if (rows.length > 0) {
//       const user = rows[0];
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {
//         // Generate JWT token
//         const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
//         res.json({ loginStatus: true, role: user.role, token });
//       } else {
//         res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Fetching Employee and Admin by their user id
// app.get('/dashboard', authenticateToken, async (req, res) => {
//   const userEmail = req.user.email;
//   try {
//     const user = await getUserByEmail(userEmail);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     if (user.role === 'employee') {
//       // Fetch employee-specific dashboard data based on the user's ID
//       const dashboardData = await fetchEmployeeDashboardData(user.userId);
//       res.json({ message: 'Employee Dashboard', data: dashboardData });
//     } else if (user.role === 'admin') {
//       // Fetch manager-specific dashboard data based on the user's ID
//       const dashboardData = await fetchManagerDashboardData(user.userId);
//       res.json({ message: 'Manager Dashboard', data: dashboardData });
//     } else {
//       res.status(403).json({ error: 'Unauthorized' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// // Route to fetch leave status for a user by email
// app.get('/api/leave-status/:email', async (req, res) => {
//   const userEmail = req.params.email;

//   try {
//     const leaveStatus = await getLeaveStatus(userEmail);
//     res.json({ leaveStatus });
//   } catch (error) {
//     console.error('Error fetching leave status:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Function to query the database and get the leave status for the user with the given email
// async function getLeaveStatus(userEmail) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT leave_status FROM leave_requests WHERE email = ?', [userEmail]);
//     connection.release();
//     return rows.length > 0 ? rows[0].leave_status : 'No leave status found';
//   } catch (error) {
//     console.error('Error fetching leave status from database:', error);
//     throw error;
//   }
// }

// // // Function to fetch employee-specific dashboard data based on the user's ID
// // async function fetchEmployeeDashboardData(userId) {
// //   try {
// //     const connection = await pool.getConnection();
  
// //     const [rows] = await connection.query('SELECT * FROM User WHERE userId = ? AND role = ?', [userId, 'employee']);
// //     connection.release();
// //     return rows; 
// //   } catch (error) {
// //     console.error('Error fetching employee dashboard data:', error);
// //     throw error;
// //   }
// // }

// // // Function to fetch manager-specific dashboard data based on the user's ID
// // async function fetchManagerDashboardData(userId) {
// //   try {
// //     const connection = await pool.getConnection();
  
// //     const [rows] = await connection.query('SELECT * FROM User WHERE userId = ? AND role = ?', [userId, 'admin']);
// //     connection.release();
// //     return rows; 
// //   } catch (error) {
// //     console.error('Error fetching manager dashboard data:', error);
// //     throw error;
// //   }
// // }


// // Function to fetch employee-specific dashboard data based on the user's ID
// async function fetchEmployeeDashboardData(userId) {
//   try {
//     const connection = await pool.getConnection();
  
//     // Join the User and leave_requests table to get the leave request status for the specific employee
//     const [rows] = await connection.query(`
//       SELECT U.*, LR.leave_status
//       FROM User U
//       LEFT JOIN leave_requests LR ON U.email = LR.email AND U.userId = ?
//       WHERE U.userId = ? AND U.role = 'employee'
//     `, [userId, userId]);
//     connection.release();
//     return rows; 
//   } catch (error) {
//     console.error('Error fetching employee dashboard data:', error);
//     throw error;
//   }
// }





// // Function to fetch manager-specific dashboard data based on the user's ID
// async function fetchManagerDashboardData(userId) {
//   try {
//     const connection = await pool.getConnection();
  
//     const [rows] = await connection.query('SELECT * FROM ManagerData WHERE userId = ?', [userId]);
//     connection.release();
//     return rows; 
//   } catch (error) {
//     console.error('Error fetching manager dashboard data:', error);
//     throw error;
//   }
// }



// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
























import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, checkEmailExists } from './models/UserSchema.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'leaveportal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const JWT_SECRET_KEY = 'your_secret_key_here';

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define endpoint to check if email exists
app.post('/auth/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already exists in the database
    const emailExists = await checkEmailExists(email);
    res.json({ exists: emailExists.exists });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { name, email, employeeID, number, password, role, dob } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {
    // Generate a unique userId
    const userId = generateUserId();

    // Check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists.exists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert the new user into the database
    await createUser(name, email, employeeID, number, hashedPassword, role, dob, userId);

    // Fetch the newly created user data from the database
    const user = await getUserByEmail(email);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to generate a unique userId
function generateUserId() {
  return uuidv4();
}

// Function to fetch user data by email
async function getUserByEmail(email) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
    connection.release();

    if (rows.length > 0) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Generate JWT token
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ loginStatus: true, role: user.role, token });
      } else {
        res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetching Employee and Admin by their user id
app.get('/dashboard', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  try {
    const user = await getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'employee') {
      // Fetch employee-specific dashboard data based on the user's ID
      const dashboardData = await fetchEmployeeDashboardData(user.userId);
      res.json({ message: 'Employee Dashboard', data: dashboardData });
    } else if (user.role === 'admin') {
      // Fetch manager-specific dashboard data based on the user's ID
      const dashboardData = await fetchManagerDashboardData(user.userId);
      res.json({ message: 'Manager Dashboard', data: dashboardData });
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route to fetch leave status for a user by email
app.get('/api/leave-status/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    const leaveStatus = await getLeaveStatus(userEmail);
    res.json({ leaveStatus });
  } catch (error) {
    console.error('Error fetching leave status:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to query the database and get the leave status for the user with the given email
async function getLeaveStatus(userEmail) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT leave_status FROM leave_requests WHERE email = ?', [userEmail]);
    connection.release();
    return rows.length > 0 ? rows[0].leave_status : 'No leave status found';
  } catch (error) {
    console.error('Error fetching leave status from database:', error);
    throw error;
  }
}

// Function to fetch employee-specific dashboard data based on the user's ID
async function fetchEmployeeDashboardData(userId) {
  try {
    const connection = await pool.getConnection();
  
    // Join the User and leave_requests table to get the leave request status for the specific employee
    const [rows] = await connection.query(`
      SELECT U.*, LR.leave_status
      FROM User U
      LEFT JOIN leave_requests LR ON U.email = LR.email AND U.userId = ?
      WHERE U.userId = ? AND U.role = 'employee'
    `, [userId, userId]);
    connection.release();
    return rows; 
  } catch (error) {
    console.error('Error fetching employee dashboard data:', error);
    throw error;
  }
}

// Function to fetch manager-specific dashboard data based on the user's ID
async function fetchManagerDashboardData(userId) {
  try {
    const connection = await pool.getConnection();
  
    const [rows] = await connection.query('SELECT * FROM ManagerData WHERE userId = ?', [userId]);
    connection.release();
    return rows; 
  } catch (error) {
    console.error('Error fetching manager dashboard data:', error);
    throw error;
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



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
import multer from 'multer';
import fs from 'fs'; // Import the fs module to work with file system
import path from 'path';
import { fileURLToPath } from 'url';

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

// Global variable to store user details
let globalUserDetails = {};

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'leaveportal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const  JWT_SECRET_KEY = 'your_secret_key_here';
// const localStorage = localStorage.setItem('token', token);





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







// Create the uploads directory if it doesn't exist
const uploadDirectory = './uploads';
if (!fs.existsSync(uploadDirectory)){
  fs.mkdirSync(uploadDirectory);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg'); // Filename for the uploaded file
  }
});

const upload = multer({ storage: storage });

// Endpoint to handle user registration with profile picture upload
app.post('/auth/register', upload.single('profilePicture'), async (req, res) => {
  // Extract registration data from request body
  const { name, email, employeeID, number, password, role, dob, gender } = req.body;

  // Check if all required fields are present in the request body
  if (!name || !email || !employeeID || !number || !password || !role || !dob || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the profile picture path
    const profilePicturePath = req.file ? req.file.path : null;
    console.log('Profile Picture Path:', profilePicturePath); // Log profile picture path

    // Check if email already exists in the database
    const emailExists = await checkEmailExists(email);
    if (emailExists.exists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate a unique userId
    const userId = generateUserId();
    console.log('Generated User ID:', userId); // Log generated user ID

    // Insert all user data into the database
    const insertQuery = `
      INSERT INTO User (name, email, employeeID, number, password, role, dob, gender, profilePicturePath, userId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [name, email, employeeID, number, hashedPassword, role, dob, gender, profilePicturePath, userId]);
    console.log('User inserted into database successfully'); // Log successful insertion

    // Store the user details in global storage
    const userDetails = { name, email, role, userId,profilePicturePath }; // Use variables directly
    globalUserDetails[email] = userDetails;

    // Send success response
    res.status(201).json({ message: 'User registered successfully', userDetails });
  } catch (error) {
    console.error('Error registering user:', error);
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


// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Serve static files (including profile pictures)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve profile pictures
app.get('/api/profile-picture/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query the database to get the profile picture path for the user
  pool.query('SELECT profilePicturePath FROM user WHERE userId = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error retrieving profile picture path:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const profilePicturePath = results[0].profile_picture_path;
      if (profilePicturePath) {
        // Construct the full URL to the profile picture
        const profilePictureUrl = `http://${req.headers.host}/profile-pictures/${profilePicturePath}`;
        // Redirect to the profile picture URL
        res.redirect(profilePictureUrl);
      } else {
        res.status(404).json({ error: 'Profile picture not found' });
      }
    }
  });
});






// Endpoint to retrieve user details
app.get('/api/user-details', (req, res) => {
  res.json(globalUserDetails);
});










// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);

    if (rows.length > 0) {
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch && user.role === role) {
        let dashboardData;

        // Check user role
        if (role === 'employee') {
          // Fetch leave data for the employee
          const leaveStatus = await getLeaveStatus(email);

          // Construct employee dashboard data
          dashboardData = {
            leaveStatus: leaveStatus,
            // Add more dashboard data here specific to employees
          };
        } else if (role === 'admin') {
          // Construct admin dashboard data if needed
          // For now, let's assume there's no specific admin dashboard data
          dashboardData = {
            message: 'Welcome to admin dashboard',
          };
        } else {
          // Invalid role
          return res.status(403).json({ loginStatus: false, error: 'Unauthorized' });
        }

        // Generate JWT token with strong secret key
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });

        // Store the user details in global storage
        const userDetails = { name: user.name, email: user.email, role: user.role, dashboardData, userId: user.userId, token , profilePicturePath: user.profilePicturePath};
        globalUserDetails[user.email] = userDetails;

        // Send user details back to the client
        return res.json({ loginStatus: true, userDetails, token });
      } else {
        return res.status(401).json({ loginStatus: false, error: 'Invalid credentials or role' });
      }
    } else {
      return res.status(401).json({ loginStatus: false, error: 'Invalid credentials' });
    }

    connection.release();
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});








// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
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
    const [rows] = await connection.query('SELECT leave_status FROM user WHERE email = ?', [userEmail]);
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
  
    const [rows] = await connection.query('SELECT * FROM user WHERE userId = ?', [userId]);
    connection.release();
    return rows; 
  } catch (error) {
    console.error('Error fetching manager dashboard data:', error);
    throw error;
  }
}



// Define a route to get individual user details by userId
app.get('/api/user-details/:userId', async (req, res) => {
  const userId = req.params.userId; // Retrieve userId from request parameters
  console.log('Requested userId:', userId); // Log the requested userId

  try {
    // Fetch user details from the database based on userId
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE userId = ?', [userId]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDetails = rows[0];
    res.status(200).json({ userDetails });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









// Assuming userDetails is a global object containing user information
const userDetails = globalUserDetails && globalUserDetails.userDetails ? globalUserDetails.userDetails : null;

if (userDetails && userDetails.userId){
  const userId = userDetails.userId;
  const token = userDetails.token; // Retrieve the JWT token from userDetails
  
  if (token) {
    // Console log the JWT token
    console.log('JWT Token:', token);
    
    // Make the API request with the JWT token included in the headers
    fetch(`http://localhost:3000/api/user-details/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('User Details:', data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  } else {
    console.error('JWT token not found in userDetails');
  }
} else {
  console.error('User details or userId not available');
}






// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




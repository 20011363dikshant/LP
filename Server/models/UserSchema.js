// // Import necessary modules
// import mysql from 'mysql2/promise';

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '', // Add your MySQL password here
//   database: 'leaveportal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Define your UserSchema class
// class UserSchema {
//   constructor(name, email, employeeID, number, password, role, dob, userId) {
//     this.name = name;
//     this.email = email;
//     this.employeeID = employeeID;
//     this.number = number;
//     this.password = password;
//     this.role = role;
//     this.dob = dob;
//     this.userId = userId;
//     this.leave = {
//       casual: { available: 5, used: 0 },
//       sick: { available: 10, used: 0 },
//       earned: { available: 10, used: 0 },
//       adjustment: { available: 10, used: 0 },
//       unpaid: { available: 10, used: 0 },
//       half: { available: 10, used: 0 }
//     };
//   }

//   // Method to save user details in the database
//   async save() {
//     try {
//       const connection = await pool.getConnection();
//       const query = 'INSERT INTO modal (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//       await connection.query(query, [this.name, this.email, this.employeeID, this.number, this.password, this.role, this.dob, this.userId]);
//       connection.release();
//       return { success: true };
//     } catch (error) {
//       console.error('Error creating user:', error);
//       return { success: false, error: 'Internal Server Error' };
//     }
//   }
// }

// // Function to check if an email already exists in the database
// async function checkEmailExists(email) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM modal WHERE email = ?', [email]);
//     connection.release();
//     return { exists: rows.length > 0 };
//   } catch (error) {
//     console.error('Error checking email:', error);
//     return { error: 'Internal Server Error' };
//   }
// }

// // Function to insert a new user into the database
// async function createUser(name, email, employeeID, number, password, role, dob, userId) {
//   try {
//     // Get a connection from the pool
//     const connection = await pool.getConnection();

//     // SQL query to insert a new user
//     const query = 'INSERT INTO modal (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
//     // Execute the query with user data as parameters
//     await connection.query(query, [name, email, employeeID, number, password, role, dob, userId]);

//     // Release the connection back to the pool
//     connection.release();

//     // Return success message
//     return { success: true };
//   } catch (error) {
//     // Log and return error message if an error occurs
//     console.error('Error creating user:', error);
//     return { success: false, error: 'Internal Server Error' };
//   }
// }

// // Export functions and UserSchema class for use in other parts of the application
// export { createUser, checkEmailExists, UserSchema };









// Import necessary modules
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'leaveportal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define your UserSchema class
class UserSchema {
  constructor(name, email, employeeID, number, password, role, dob, userId) {
    this.name = name;
    this.email = email;
    this.employeeID = employeeID;
    this.number = number;
    this.password = password;
    this.role = role;
    this.dob = dob;
    this.userId = userId;
    this.leave = {
      casual: { available: 5, used: 0 },
      sick: { available: 10, used: 0 },
      earned: { available: 10, used: 0 },
      adjustment: { available: 10, used: 0 },
      unpaid: { available: 10, used: 0 },
      half: { available: 10, used: 0 }
    };
  }

  // Method to save user details in the database
  async save() {
    try {
      const connection = await pool.getConnection();
      const query = 'INSERT INTO modal (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await connection.query(query, [this.name, this.email, this.employeeID, this.number, this.password, this.role, this.dob, this.userId]);
      connection.release();
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Internal Server Error' };
    }
  }
}

// Function to check if an email already exists in the database
async function checkEmailExists(email) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM modal WHERE email = ?', [email]);
    connection.release();
    return { exists: rows.length > 0 };
  } catch (error) {
    console.error('Error checking email:', error);
    return { error: 'Internal Server Error' };
  }
}

// Function to insert a new user into the database
async function createUser(name, email, employeeID, number, password, role, dob, userId) {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // SQL query to insert a new user
    const query = 'INSERT INTO user (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    // Execute the query with user data as 
    await connection.query(query, [name, email, employeeID, number, password, role, dob, userId]);

    // Release the connection back to the pool
    connection.release();

    // Return success message
    return { success: true };
  } catch (error) {
    // Log and return error message if an error occurs
    console.error('Error creating user:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

// Export functions and UserSchema class for use in other parts of the application
export { createUser, checkEmailExists, UserSchema };

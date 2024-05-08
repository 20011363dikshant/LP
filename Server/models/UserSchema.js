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

//      // Method to update leave data

//      async updateLeaveData(leaveType, available, used) {
//       try {
//         const connection = await pool.getConnection();
//         const query = `UPDATE user SET leave.${leaveType}.available = ?, leave.${leaveType}.used = ? WHERE userId = ?`;
//         await connection.query(query, [available, used, this.userId]);
//         connection.release();
//         return { success: true };
//       } catch (error) {
//         console.error('Error updating leave data:', error);
//         return { success: false, error: 'Internal Server Error' };
//       }
//     }
  
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
//     const query = 'INSERT INTO user (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
//     // Execute the query with user data as 
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

// /// Function to approve leave request
// async function approveLeaveRequest(userId, leaveType, available, used) {
//   try {
//     // Fetch user from the database based on userId
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM user WHERE userId = ?', [userId]);
//     connection.release();

//     if (rows.length === 0) {
//       console.error('User not found');
//       return;
//     }

//     const userData = rows[0];
//     const user = new UserSchema(userData.name, userData.email, userData.employeeID, userData.number, userData.password, userData.role, userData.dob, userData.userId);

//     // Update the leave data for the specific user
//     const result = await user.updateLeaveData(leaveType, available, used);
//     if (result.success) {
//       // Leave data updated successfully
//       console.log('Leave data updated successfully');
//     } else {
//       // Failed to update leave data
//       console.error('Failed to update leave data');
//     }
//   } catch (error) {
//     console.error('Error approving leave request:', error);
//   }
// // }

// }



// // Export functions and UserSchema class for use in other parts of the application
// export { createUser, checkEmailExists, approveLeaveRequest, UserSchema };




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
//       const query = 'INSERT INTO user (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//       await connection.query(query, [this.name, this.email, this.employeeID, this.number, this.password, this.role, this.dob, this.userId]);
//       connection.release();
//       return { success: true };
//     } catch (error) {
//       console.error('Error creating user:', error);
//       return { success: false, error: 'Internal Server Error' };
//     }
//   }

//   // Method to update leave data
//   async updateLeaveData(leaveType, available, used) {
//     try {
//       const connection = await pool.getConnection();
//       const query = `UPDATE user_leave_data SET ${leaveType}_available = ?, ${leaveType}_used = ? WHERE user_id = ?`;
//       await connection.query(query, [available, used, this.userId]);
//       connection.release();
//       return { success: true };
//     } catch (error) {
//       console.error('Error updating leave data:', error);
//       return { success: false, error: 'Internal Server Error' };
//     }
//   }
// }

// // Function to check if an email already exists in the database
// async function checkEmailExists(email) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
//     connection.release();
//     return { exists: rows.length > 0 };
//   } catch (error) {
//     console.error('Error checking email:', error);
//     return { error: 'Internal Server Error' };
//   }
// }

// // // Function to insert a new user into the database
// // async function createUser(name, email, employeeID, number, password, role, dob, userId) {
// //   try {
// //     // Get a connection from the pool
// //     const connection = await pool.getConnection();

// //     // Start transaction
// //     await connection.beginTransaction();

// //     // Insert user details into the User table
// //     await connection.query('INSERT INTO user (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, employeeID, number, password, role, dob, userId]);

// //     // Insert initial leave values into the user_leave_data table
// //     await connection.query('INSERT INTO user_leave_data (user_id, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
// //       [userId, 5, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0]);

// //     // Commit the transaction
// //     await connection.commit();

// //     // Release the connection back to the pool
// //     connection.release();

// //     // Return success message
// //     return { success: true };
// //   } catch (error) {
// //     // Rollback transaction if any error occurs
// //     if (connection) {
// //       await connection.rollback();
// //     }
// //     // Log and return error message if an error occurs
// //     console.error('Error creating user:', error);
// //     return { success: false, error: 'Internal Server Error' };
// //   }
// // }


// // Function to create a new user
// export async function createUser(connection, name, email, employeeID, number, hashedPassword, role, dob, userId, initialLeaveValues) {
//   try {
//     // Start transaction
//     await connection.beginTransaction();

//     // Insert user details into the User table
//     await connection.query('INSERT INTO User (name, email, employeeID, number, password, role, dob, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, employeeID, number, hashedPassword, role, dob, userId]);

//     // Insert initial leave values into the user_leave_data table
//     await connection.query('INSERT INTO user_leave_data (user_id, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [userId, initialLeaveValues.casual.available, initialLeaveValues.casual.used, initialLeaveValues.sick.available, initialLeaveValues.sick.used, initialLeaveValues.earned.available, initialLeaveValues.earned.used, initialLeaveValues.adjustment.available, initialLeaveValues.adjustment.used, initialLeaveValues.unpaid.available, initialLeaveValues.unpaid.used, initialLeaveValues.half.available, initialLeaveValues.half.used]);

//     // Commit the transaction
//     await connection.commit();

//     return { success: true };
//   } catch (error) {
//     // Rollback transaction if any error occurs
//     if (connection) {
//       await connection.rollback();
//     }
//     console.error('Error creating user:', error);
//     return { success: false, error: 'Internal Server Error' };
//   }
// }




// // Function to approve leave request
// async function approveLeaveRequest(userId, leaveType, available, used) {
//   try {
//     // Fetch user from the database based on userId
//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('SELECT * FROM user WHERE userId = ?', [userId]);
//     connection.release();

//     if (rows.length === 0) {
//       console.error('User not found');
//       return;
//     }

//     const userData = rows[0];
//     const user = new UserSchema(userData.name, userData.email, userData.employeeID, userData.number, userData.password, userData.role, userData.dob, userData.userId);

//     // Update the leave data for the specific user
//     const result = await user.updateLeaveData(leaveType, available, used);
//     if (result.success) {
//       // Leave data updated successfully
//       console.log('Leave data updated successfully');
//     } else {
//       // Failed to update leave data
//       console.error('Failed to update leave data');
//     }
//   } catch (error) {
//     console.error('Error approving leave request:', error);
//   }
// }

// // Export functions and UserSchema class for use in other parts of the application
// export { createUser, checkEmailExists, approveLeaveRequest, UserSchema };

















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
  constructor(name, email, employeeID, number, password, role, dob, userId,profilePicturePath) {
    this.name = name;
    this.email = email;
    this.employeeID = employeeID;
    this.number = number;
    this.password = password;
    this.role = role;
    this.dob = dob;
    this.userId = userId;
    this.userId = profilePicturePath;

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
      const query = 'INSERT INTO user (name, email, employeeID, number, password, role, dob, userId,profilePicturePath) VALUES (? ,?, ?, ?, ?, ?, ?, ?, ?)';
      await connection.query(query, [this.name, this.email, this.employeeID, this.number, this.password, this.role, this.dob, this.userId, this.profilePicturePath]);
      connection.release();
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Internal Server Error' };
    }
  }

  // Method to update leave data
  async updateLeaveData(leaveType, available, used) {
    try {
      const connection = await pool.getConnection();
      const query = `UPDATE user_leave_data SET ${leaveType}_available = ?, ${leaveType}_used = ? WHERE user_id = ?`;
      await connection.query(query, [available, used, this.userId]);
      connection.release();
      return { success: true };
    } catch (error) {
      console.error('Error updating leave data:', error);
      return { success: false, error: 'Internal Server Error' };
    }
  }
}

// // Function to create a new user
// async function createUser(name, email, employeeID, number, password,gender, role, dob, userId, initialLeaveValues) {
//   try {
//     // Get a connection from the pool
//     const connection = await pool.getConnection();

//     // Start transaction
//     await connection.beginTransaction();

//     // Insert user details into the User table
//     await connection.query('INSERT INTO user (name, email, employeeID, number, password,gender, role, dob, userId, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)', [name, email, employeeID, number, password,gender, role, dob, userId, initialLeaveValues.casual.available, initialLeaveValues.casual.used, initialLeaveValues.sick.available, initialLeaveValues.sick.used, initialLeaveValues.earned.available, initialLeaveValues.earned.used, initialLeaveValues.adjustment.available, initialLeaveValues.adjustment.used, initialLeaveValues.unpaid.available, initialLeaveValues.unpaid.used, initialLeaveValues.half.available, initialLeaveValues.half.used]);

//     // Insert initial leave values into the user_leave_data table
//     // await connection.query('INSERT INTO user_leave_data (user_id, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       // [userId, initialLeaveValues.casual.available, initialLeaveValues.casual.used, initialLeaveValues.sick.available, initialLeaveValues.sick.used, initialLeaveValues.earned.available, initialLeaveValues.earned.used, initialLeaveValues.adjustment.available, initialLeaveValues.adjustment.used, initialLeaveValues.unpaid.available, initialLeaveValues.unpaid.used, initialLeaveValues.half.available, initialLeaveValues.half.used]);

//     // Commit the transaction
//     await connection.commit();

//     // Release the connection back to the pool
//     connection.release();

//     // Return success message
//     return { success: true };
//   } catch (error) {
//     // Rollback transaction if any error occurs
//     if (connection) {
//       await connection.rollback();
//     }
//     // Log and return error message if an error occurs
//     console.error('Error creating user:', error);
//     return { success: false, error: 'Internal Server Error' };
//   }
// }

// Function to create a new user
async function createUser(name, email, employeeID, number, password, gender, role, dob, userId, profilePicturePath,initialLeaveValues) {
  let connection; // Declare connection variable here

  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Insert user details into the User table
    await connection.query('INSERT INTO user (name, email, employeeID, number, password, gender, role, dob,profilePicturePath, userId, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)', [name, email, employeeID, number, password, gender, role, dob, userId, initialLeaveValues.casual.available, initialLeaveValues.casual.used, initialLeaveValues.sick.available, initialLeaveValues.sick.used, initialLeaveValues.earned.available, initialLeaveValues.earned.used, initialLeaveValues.adjustment.available, initialLeaveValues.adjustment.used, initialLeaveValues.unpaid.available, initialLeaveValues.unpaid.used, initialLeaveValues.half.available, initialLeaveValues.half.used]);

    // Insert initial leave values into the user_leave_data table
    // await connection.query('INSERT INTO user_leave_data (user_id, casual_available, casual_used, sick_available, sick_used, earned_available, earned_used, adjustment_available, adjustment_used, unpaid_available, unpaid_used, half_available, half_used) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    // [userId, initialLeaveValues.casual.available, initialLeaveValues.casual.used, initialLeaveValues.sick.available, initialLeaveValues.sick.used, initialLeaveValues.earned.available, initialLeaveValues.earned.used, initialLeaveValues.adjustment.available, initialLeaveValues.adjustment.used, initialLeaveValues.unpaid.available, initialLeaveValues.unpaid.used, initialLeaveValues.half.available, initialLeaveValues.half.used]);

    // Commit the transaction
    await connection.commit();

    // Release the connection back to the pool
    connection.release();

    // Return success message
    return { success: true };
  } catch (error) {
    // Rollback transaction if any error occurs
    if (connection) {
      await connection.rollback();
    }
    // Log and return error message if an error occurs
    console.error('Error creating user:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}














// Function to check if an email already exists in the database
async function checkEmailExists(email) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
    connection.release();
    return { exists: rows.length > 0 };
  } catch (error) {
    console.error('Error checking email:', error);
    return { error: 'Internal Server Error' };
  }
}




// Function to approve leave request
async function approveLeaveRequest(userId, leaveType, available, used) {
  try {
    // Fetch user from the database based on userId
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM user WHERE userId = ?', [userId]);
    connection.release();

    if (rows.length === 0) {
      console.error('User not found');
      return;
    }

    const userData = rows[0];
    const user = new UserSchema(userData.name, userData.email, userData.employeeID, userData.number,userData.gender , userData.password, userData.role, userData.dob, userData.userId);

    // Update the leave data for the specific user
    const result = await user.updateLeaveData(leaveType, available, used);
    if (result.success) {
      // Leave data updated successfully
      console.log('Leave data updated successfully');
    } else {
      // Failed to update leave data
      console.error('Failed to update leave data');
    }
  } catch (error) {
    console.error('Error approving leave request:', error);
  }
}


// Export functions and UserSchema class for use in other parts of the application
export { createUser, checkEmailExists, approveLeaveRequest, UserSchema };

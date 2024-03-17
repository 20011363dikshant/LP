// import express from "express";
// import con from "../utils/db.js";
// import jwt from "jsonwebtoken";
// // import leaveRequestRoute from './leaveRequestRoute';
// // import { leaveRequestRoute } from "./Routes/AdminRoute.js";
// import { leaveRequestRoute } from "./LeaveRequestRoute.js";


// const router = express.Router();

// router.post("/adminlogin", (req, res) => {
//   console.log("Received request to /auth/adminLogin:");
//   console.log(req.body);

//   // checking credentials for the system
//   const sql = "SELECT * from admin Where email = ? and password =?";
//   con.query(
//     sql,
//     [req.body.email, req.body.password, req.body.role],
//     (err, result) => {
//       if (err) {
//         console.error("Error executing query:");
//         console.error(err);
//         return res.json({ loginStatus: false, Error: "Querry error" });
//       }

//       if (result.length > 0) {
//         const email = result[0].email;

//         //gentrating a token ...// this secret key has to be secret and more secure key and atleast 32 character... this is just for example .....this 1d means these cookies will expire in 1 day
//         const token = jwt.sign(
//           { role: "admin", email: email },
//           "jwt_secret_key",
//           { expiresIn: "1d" }
//           // now this token will be stored inside the browser cookie 
//         );
//         res.cookie('token',token)
//         console.log(`Generated token for user with email ${email}:`);
//         console.log(token);
//         return res.json({ loginStatus: true});
//       } else {
//         console.log("Invalid email or password");
//         return res.json({ loginStatus: false, Error: "Wrong email or password"});
//       }
//     }
//   );
// });

// // export { router as adminRouter };
// export { router as leaveRequestRoute };








// import express from "express";
// import con from "../utils/db.js";
// import { router as adminRouter } from "./AdminRoute.js";

// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post("/adminlogin", (req, res) => {
//   console.log("Received request to /auth/adminlogin:");
//   console.log(req.body);

//   // checking credentials for the system
//   const sql = "SELECT * from admin Where email = ? and password =?";
//   con.query(
//     sql,
//     [req.body.email, req.body.password],
//     (err, result) => {
//       if (err) {
//         console.error("Error executing query:");
//         console.error(err);
//         return res.json({ loginStatus: false, Error: "Query error" });
//       }

//       if (result.length > 0) {
//         const email = result[0].email;

//         // generating a token
//         const token = jwt.sign(
//           { role: "admin", email: email },
//           "jwt_secret_key",
//           { expiresIn: "1d" }
//         );
//         res.cookie('token', token, { path: '/' });
//         console.log(`Generated token for user with email ${email}:`);
//         console.log(token);
//         return res.json({ loginStatus: true });
//       } else {
//         console.log("Invalid email or password");
//         return res.json({ loginStatus: false, Error: "Wrong email or password"});
//       }
//     }
//   );
// });

// export { router as adminRouter };















const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route handler for /auth/adminLogin
app.post('/auth/adminLogin', (req, res) => {
  // Handle login logic here
  // For demonstration purposes, just sending back a response
  res.json({ loginStatus: true, message: 'Login successful' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


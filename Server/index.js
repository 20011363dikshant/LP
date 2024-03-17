
// import express from "express";
// import cors from 'cors'
// import { leaveRequestRoute } from "./Routes/AdminRoute.js";


// const app = express();

// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:3000/auth/adminLogin"],
//   methods: ['GET', 'POST', 'PUT'],
//   credentials: true,
// }));

// app.use(express.json());

// app.use('/auth', leaveRequestRoute);
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// app.listen(3000, () => {
//   console.log("Server is running");

//   console.log("CORS options:");
//   console.log(app.get("cors"));

//   console.log("Routes:");
//   app._router.stack.forEach((route, index) => {
//     console.log(`${index}: ${route.path}`);
//   });
// });













import express from "express";
import cors from 'cors'
import con from "./utils/db.js";
import { adminRouter } from "./AdminRoute.js"; // Update import statement

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
}));

app.use(express.json());

app.use('/auth', adminRouter);

app.listen(3000, () => {
  console.log("Server is running");
});

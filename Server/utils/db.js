// import mysql from 'mysql'
// const con =mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "leaveportal"
// })

// con.connect(function(err){
//     if(err){
//         console.log("connection eerror")
//     }else{
//         console.log("connected")
//     }
// })

// export default con;






// // db.js

// import mysql from 'mysql';

// const con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'leaveportal'
// });

// con.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to the database');
// });

// export default con;
















import mysql from 'mysql';

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

export default con;

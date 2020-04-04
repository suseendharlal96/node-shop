// // USING NORMAL MYSQL
// // const mysql = require('mysql2');

// // const pool = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root',
// //   database: 'node-shop',
// //   password: 'susee@1965LSSL'
// // });

// // module.exports = pool.promise();

// // USING SEQUALIZER
// // const Sequalize = require('sequelize');

// // const sequelize = new Sequalize('node-shop', 'root', 'susee@1965LSSL', {
// //   dialect: 'mysql',
// //   host: 'localhost'
// // });

// // module.exports = sequelize;

// // USING MONGODB:

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let db;

// const mongoConnect = cb => {
//   MongoClient.connect(
//     "mongodb+srv://suseendhar:susee@1965LSSL@suseendhar-v3enu.mongodb.net/shop?retryWrites=true&w=majority",
//     { useUnifiedTopology: true }
//   )
//     .then(client => {
//       console.log("CONNECTED");
//       db = client.db();
//       cb();
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (db) {
//     return db;
//   }
//   throw "Not found";
// };
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

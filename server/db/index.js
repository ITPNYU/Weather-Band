const mysql = require('mysql');

//a pool will allow us to make call to the pool ie query and manage a list of connection
const pool = mysql.createPool({
  connectionLimit:10,
  host:process.env.WB_HOST,
  user:process.env.WB_USER,
  password:process.env.WB_PASS,
  database:process.env.WB_DB,
});

let db = {};

db.all = () => {
  return new Promise((resolve,reject)=>{
    pool.query('SELECT * FROM weather_data.data',(err,results) =>{
      if(err){
        return reject(err);
      }
      return resolve(results);
    });
  });
};

module.exports = db;

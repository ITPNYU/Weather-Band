//load environment variables
require('dotenv').config();

//express setting
var express = require('express');
//const db = require('./server/db/index.js');
const bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8000;
app.use(express.json());
app.use(bodyParser.json()); 						                   // for  application/json
app.use(bodyParser.urlencoded({extended: false}));
app.listen(port, function(){
  console.log('Server is running on port: ',port);
});

//mysql setting
const mysql = require('mysql');

//a pool will allow us to make call to the pool ie query and manage a list of c>
const pool = mysql.createPool({
  connectionLimit:10,
  host:process.env.WB_HOST, // localhost
  user:process.env.WB_USER, // your database user
  password:process.env.WB_PASS, // your database user's password
  database:process.env.WB_DB, // database name
});

//front end access?
app.use(express.static('public'));

// //verify macaddress & seesion key
// const authorizedDevice = function(req, res, next){
//   macAddress = req.body.macAddress || req.query.macAddress;
//   sessionKey = req.body.sessionKey || req.query.sessionKey;
// // select from authorized_device table
//   const query = 'SELECT mac_address FROM weather_data.authorized_device WHERE mac_address = ? and session_key = ?';
//   const params = [macAddress,sessionKey];
//   console.log('params: ', params)
//
//   pool.query(query,params,(error,results,feilds)=>{
//     if(error){
//       console.error(error);
//       res.status(500).send('server error\n');
//     }else{
//       if(results.length === 1){
//         console.log(macAddress + 'is authorized');
//         next();
//       }else{
//         console.log(macAddress + 'is denied. Invalid sessionKey.');
//         res.status(401).send('unauthorized\n');
//       }
//     }
//   });
// }

// //check mac address
// app.use(authorizedDevice);


//post data
app.post('/data',function(req,res){
  const macAddress = req.body.macAddress;
  const data = req.body.data;
  if (!data) {
    res.status(400).send(`Bad request, data can not be null\n`);
    return;
  }
  // if(macAddress != process.env.PRIMARY_AUTH_KEY){
  //   res.status(400).send(`device not authorized to post`);
  //   return;
  // }

  // combine data into format >> column1,coulumn2,...,columnN val1,val2,...,valN
  const columns = Object.keys(data).map(key => {return key});
  const values = Object.keys(data).map(val => {
    if(typeof data[val] == 'string'){
      return '"'+ data[val] +'"';
    }else{
      return data[val]
    }
  });
  //construct INSERT query
  const insert = `INSERT INTO weather_data.data (${columns.join(',')}) VALUES (${values.join(',')})`;
  console.log(insert);

  // posting to database
  pool.query(insert,(error, results,feilds)=>{
    if(error){
      console.log(error);
      res.status(500).send('server error\n');
    }else{
      // location header points to the new resource
      res.location(`/data/${results.insertId}`);
      res.status(201).send(`Created ${results.insertId}\n`);
    }
  });
});

//get alldata
app.get('/data/all',function(req,res){
  const macAddress = req.body.macAddress || req.query.macAddress;
  const query = 'SELECT * FROM data';
  const params = [macAddress];
  console.log(query, params);

  pool.query(query, params, (error, results, fields) => {
    // return pretty JSON which is inefficient but much easier to understand
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results, null, 2));
  });
});

//get by ID
app.get('/data/:transactionID', function(req,res) {
  const transactionID = req.params.transactionID;
  const query = 'SELECT * FROM data WHERE id=?';
  const params = [transactionID];

  pool.query(query, params, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('server error\n');
    } else if (results.length > 0) {
      // return pretty JSON which is inefficient but much easier to understand
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results[0], null, 2));
    } else {
      res.status(404).send(`Id ${transactionID} not found \n`);
    }
  });
});

// get by category
app.get('/data/category',function(req,res){
let category = req.body.categor;
const macAddress = req.body.macAddress;
const query = `SELECT ${category} FROM data;`
const params = [macAddress];
console.log(res.body);
console.log(query);

pool.query(query,params, (error, results, fields) => {
  res.setHeader('Content-Type', 'appplication/json');
  res.end(JSON.stringify(results, null, 2));
  console.log("result :" + resules + "feilds : "+ feild);
});
});

//get by mac macAddress
app.get('/data/macAddress/:mac',function(req,res){
let mac = req.params.mac;
const macAddress = req.body.macAddress;
const query = 'SELECT * FROM data WHERE mac_address=?';
const params = [macAddress];
console.log(query);

pool.query(query,params, (error, results, fields) => {
  if (error) {
    console.error(error);
    res.status(500).send('server error\n');
  } else if (results.length > 0) {
    // return pretty JSON which is inefficient but much easier to understand
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results, null, 2));
  } else {
    res.status(404).send(`Id ${transactionID} not found \n`);
  }
});
});

// get by time


app.get('/', function (req, res) {
  res.send('Hello Weather!');
});

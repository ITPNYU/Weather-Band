//load environment variables
require("dotenv").config();

//express setting
const express = require("express");
// forparsing the body to JSONformat
const bodyParser = require("body-parser");
// for https
const cors = require("cors");
// for getting data by time
const moment = require("moment");

//logging to file as a back up
const fs = require("fs");
const logger = require("morgan");
const path = require("path");
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors()); // enable cross-origin resource sharing
app.use(logger("dev")); // log to console
app.use(logger("combined", { stream: accessLogStream })); // log to file
app.use(bodyParser.json()); // for  application/json
app.use(bodyParser.urlencoded({ extended: false }));
// running server
app.listen(port, function () {
  console.log("Server is running on port: ", port);
});

//mysql setting
const mysql = require("mysql");

//a pool will allow us to make call to the pool ie query and manage a list of c>
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.WB_HOST, // localhost
  user: process.env.WB_USER, // your database user
  password: process.env.WB_PASS, // your database user's password
  database: process.env.WB_DB, // database name
});

//front end access?
app.use(express.static("public"));

//verify macaddress & seesion key
function authorizedDevice(req, res) {
  macAddress = req.body.macAddress || req.query.macAddress;
  sessionKey = req.body.sessionKey || req.query.sessionKey;
  // select from authorized_device table
  const query =
    "SELECT mac_address FROM authorized_device WHERE mac_address = ? and session_key = ?";
  const params = [macAddress, sessionKey];
  console.log("params: ", params);

  pool.query(query, params, (error, results, feilds) => {
    if (error) {
      console.error(error);
      res.status(500).send("server error\n");
    } else {
      // if the macAddress and sessionkey are valid
      if (results.length === 1) {
        console.log(`${macAddress} is authorized`);
        next(req, res);
      } else {
        console.log(`${macAddress} is denied. Invalid sessionKey.`);
        res.status(401).send("unauthorized\n");
      }
    }
  });
}

// function for posting the data
function next(req, res) {
  const macAddress = req.body.macAddress;
  const data = req.body.data;
  if (!data) {
    res.status(400).send(`Bad request, data can not be null\n`);
    return;
  }

  // combine data into format >> column1,coulumn2,...,columnN val1,val2,...,valN
  const columns = Object.keys(data).map((key) => {
    return key;
  });
  const values = Object.keys(data).map((val) => {
    if (typeof data[val] == "string") {
      return '"' + data[val] + '"';
    } else {
      return data[val];
    }
  });
  //construct INSERT query
  const insert = `INSERT INTO weather_data.data (mac_address,${columns.join(
    ","
  )}) VALUES ("${macAddress}",${values.join(",")})`;
  console.log(insert);

  // posting to database
  pool.query(insert, (error, results, feilds) => {
    if (error) {
      console.log(error);
      res.status(500).send("server error\n");
    } else {
      // location header points to the new resource
      res.location(`/data/${results.insertId}`);
      res.status(201).send(`Created ${results.insertId}\n`);
    }
  });
}

//post data
app.post("/data", function (req, res) {
  //check mac address
  authorizedDevice(req, res);
});

//get alldata of that macAddress
app.get("/data/all", function (req, res) {
  const macAddress = req.body.macAddress || req.query.macAddress;
  const query = "SELECT * FROM data WHERE mac_address=?";
  const params = [macAddress];
  console.log(query, params);

  pool.query(query, params, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send("server error\n");
    } else if (results.length > 0) {
      // return pretty JSON which is inefficient but much easier to understand
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results, null, 2));
    } else {
      res.status(404).send(`macAddress ${macAddress} not found \n`);
    }
  });
});

//get data by ID
app.get("/data/id/:transactionID", function (req, res) {
  const transactionID = req.params.transactionID;
  const query = "SELECT * FROM data WHERE id=?";
  const params = [transactionID];
  console.log(query, params);

  pool.query(query, params, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send("server error\n");
    } else if (results.length > 0) {
      // return pretty JSON which is inefficient but much easier to understand
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results[0], null, 2));
    } else {
      res.status(404).send(`Id ${transactionID} not found \n`);
    }
  });
});

// get all data from that macAddress by category
app.get("/data/category", function (req, res) {
  let category = req.body.category;
  const macAddress = req.body.macAddress;
  const query = `SELECT ${category} FROM data WHERE mac_address="${macAddress}";`;
  const params = [category, macAddress];
  console.log(query, params);

  pool.query(query, params, (error, results, fields) => {
    res.setHeader("Content-Type", "appplication/json");
    res.end(JSON.stringify(results, null, 2));
  });
});

// get data by time
app.get("/data/date", function (req, res) {
  const macAddress = req.body.macAddress;
  const from = moment(req.body.from).format("YYYY-MM-DD HH:mm:ss");
  const to = moment(req.body.to).format("YYYY-MM-DD HH:mm:ss");
  const query = `SELECT * FROM data WHERE mac_address="${macAddress}" and recorded_at between '${from}' and '${to}';`;
  const params = [macAddress, from, to];
  console.log(query, params);

  pool.query(query, params, (error, results, fields) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results, null, 2));
  });
});

// get data by location

// //test
// app.get('/', function (req, res) {
//   res.send('Hello Weather!');
// });

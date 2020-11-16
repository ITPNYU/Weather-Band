const express = require('express');
const db = require('../db/index.js');

const router = express.Router();

router.get('/',async (req, res, next) =>{
  // res.json({test: 'test'});
  try {
    let results = await db.all();
    res.json(results);
  } catch(e){
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;

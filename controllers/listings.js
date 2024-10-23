// controllers/listings.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get('/', async (req, res) => {
    try{
        const listings =  await Listing.find();
        console.log(listings)
        res.send('Listings index page');
    }
    catch(error){
        console.log(error);
    }
    
  });

module.exports = router;
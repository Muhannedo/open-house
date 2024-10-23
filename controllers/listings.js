// controllers/listings.js

const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");

router.get("/", async (req, res) => {
  try {
    // const listings = await Listing.find();
    const populatedListings = await Listing.find({}).populate('owner');
    // console.log(listings);
    console.log('Populated Listings:', populatedListings);
    // res.send('Listings index page');
    res.render("listings/index.ejs",{listings: populatedListings});
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new' , (req, res) =>{
res.render("listings/new.ejs");
});

router.post('/', async (req , res)=>{
  req.body.owner= req.session.user._id;
  await Listing.create(req.body);
  res.redirect('/listings');  
})


router.get('/:listingId', async (req, res) => {
  try {
    const populatedListings = await Listing.findById(
      req.params.listingId
    ).populate('owner');

    res.render('listings/show.ejs', {
      listing: populatedListings,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
module.exports = router;

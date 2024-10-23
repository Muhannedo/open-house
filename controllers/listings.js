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


// controllers/listings.js

router.get('/:listingId', async (req, res) => {
  try {
    const populatedListings = await Listing.findById(
      req.params.listingId
    ).populate('owner');

    const userHasFavorited = populatedListings.favoritedByUsers.some((user) =>
      user.equals(req.session.user._id)
    );

    res.render('listings/show.ejs', {
      listing: populatedListings,
      userHasFavorited: userHasFavorited,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// delete button to delete the house
// controllers/listings.js

router.delete('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (listing.owner.equals(req.session.user._id)) {
      await listing.deleteOne();
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// controller to edit the listing
router.get('/:listingId/edit', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    res.render('listings/edit.ejs', {
      listing: currentListing,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// controller to update the listing
router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// controllers/listings.js

router.post('/:listingId/favorited-by/:userId', async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $push: { favoritedByUsers: req.params.userId },
    });
    res.redirect(`/listings/${req.params.listingId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
// controllers/listings.js

router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $pull: { favoritedByUsers: req.params.userId },
    });
    res.redirect(`/listings/${req.params.listingId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
module.exports = router;

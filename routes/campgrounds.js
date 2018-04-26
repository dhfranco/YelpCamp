var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX route
router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};

    Campground.create( newCampground, function(err, campground){
                if (err){
                    console.log(err);
                } else {
                    console.log("Newly created campground:");
                    console.log(campground);
                }
            });
            

    res.redirect("/campgrounds");
});

// NEW route (show form to create a new campground)
// NOTE: This MUST be listed before /campgrounds/:id route !!!! 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW route (show more info on a single campground)
router.get("/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;
    var campgroundUpdates = req.body.campground;
            
    Campground.findByIdAndUpdate(id, campgroundUpdates, function(err, updatedCampground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + id);  // show page
        }
    });
});

// DISTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    var id = req.params.id;

    Campground.findByIdAndRemove(id, function(err, updatedCampground){
        if (err){
            console.log(err);
        } 
        res.redirect("/campgrounds");
    });
});

module.exports = router;
var express = require("express");
var router = express.Router({mergeParams: true});   ////// Pass along :id
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log("@@@@@@  New id: " + id);
    Campground.findById(id, function(err, campground){
        if (err){
            console.log(err);
        } else {
            console.log("@@@@@@@  New Comment: " + campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create( req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");

                    res.redirect("/campgrounds/" + campground._id);                
                }
            });
        }
    });
});

// EDIT 
router.get("/:comment_id/edit", function(req, res) {
    var comment_id = req.params.comment_id;
    Comment.findById(comment_id, function(err, foundComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    var id = req.params.id;
    var commentId = req.params.comment_id;

    Comment.findByIdAndUpdate(commentId, req.body.comment, function(err, updatedComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + id);  // show page
        }
    });
});

// DISTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    var comment_id = req.params.comment_id;

    Comment.findByIdAndRemove(comment_id, function(err, updatedCampground){
        if (err){
            console.log(err);
        } 
        req.flash("success","Comment deleted");

        res.redirect("/campgrounds/" + req.params.id);  // show page
    });
});




module.exports = router;
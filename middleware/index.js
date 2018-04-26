var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    console.log("checkCampgroundOwnership");
    if(req.isAuthenticated()){
        // console.log("checkCampgroundOwnership  authenticated");

        var id = req.params.id;
        Campground.findById(id, function(err, foundCampground){
            if (err){
                console.log("@@@@@" + err);
                req.flash("error","Campground not found");

                res.redirect("back");
            } else {
                // console.log("checkCampgroundOwnership campground found");
                // console.log("checkCampgroundOwnership foundCampground.author.id: " + foundCampground.author.id);
                // console.log("checkCampgroundOwnership req.user._id: " + req.user._id);

                if(foundCampground.author.id.equals(req.user._id)){   // .equals is a mongoose override
                    next();
                } else {
                    req.flash("error","You don't have permission to do that!");

                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("checkCampgroundOwnership Not authenticated");

        req.flash("error","You must be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    console.log("checkCommentOwnership");
    if(req.isAuthenticated()){

        var comment_id = req.params.comment_id;
        Comment.findById(comment_id, function(err, foundComment){
            if (err){
                console.log(err);
                res.redirect("back");
            } else {
                // console.log("checkCommentOwnership Comment found");

                if(foundComment.author.id.equals(req.user._id)){   // .equals is a mongoose override
                    next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("checkCommentOwnership Not authenticated");
        req.flash("error","You must be logged in to do that");

        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must be logged in first!");
    res.redirect("/login");
};

module.exports = middlewareObj;
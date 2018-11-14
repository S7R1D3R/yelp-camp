var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// INDEX - index.js
router.get("/", (req, res) => {

    console.log(req.user);

    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {

        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });

});

// CREATE - Makes a new Campground
router.post("/", middleware.isLoggedIn, (req, res) => {

    // Get data from form and add to campgrounds
    var name = req.body.name,
        image = req.body.image,
        description = req.body.description,

        author = {
            id: req.user._id,
            username: req.user.username
    }

    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    }

    Campground.create(newCampground, function(err, campground) {

        if(err) {
            console.log(err)
            req.flash("error", "Something went wrong.");
            res.redirect("back");
        
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

// NEW FORM - Form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {

    res.render("campgrounds/new");
});

// SHOW - Page to show all the details about the campground
router.get("/:id", function(req, res) {

    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {

        if(err || !campground) {
            console.log(err);
            req.flash("error", "Campground not found.");
            res.redirect("back");
        } else {

            // Render the show template
            console.log(campground);
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT - Page to edit the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {

        Campground.findById(req.params.id, (err, campground) => {

            if(err || !campground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");

            } else {
                res.render("campgrounds/edit", {campground: campground});
            }
        });
});

// UPDATE - Put request
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {

    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {

        if(err) {
            res.redirect("/campgrounds");

        } else {
            req.flash("success", "Campground successfully updated.");    
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - Removes campground from database
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {

    Campground.findByIdAndRemove(req.params.id, (err) => {

        if(err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds");

        } else {
            req.flash("success", "Campground deleted.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
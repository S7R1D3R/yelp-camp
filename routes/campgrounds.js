var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

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
router.post("/", isLoggedIn, (req, res) => {

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
        
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

// NEW FORM - Form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {

    res.render("campgrounds/new");
});

// SHOW - Page to show all the details about the campground
router.get("/:id", function(req, res) {

    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {

        if(err) {
            console.log(err)
        } else {

            // Render the show template
            console.log(campground);
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// EDIT - Page to eddit the campground
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {

        Campground.findById(req.params.id, (err, campground) => {

            res.render("campgrounds/edit", {campground: campground});
        });
});

// UPDATE - Put request
router.put("/:id", checkCampgroundOwnership, (req, res) => {

    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {

        if(err) {
            res.redirect("/campgrounds");

        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - Removes campground from database
router.delete("/:id", checkCampgroundOwnership, (req, res) => {

    Campground.findByIdAndRemove(req.params.id, (err) => {

        if(err) {
            res.redirect("/campgrounds");

        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {

        return next();
    }

    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {

    if(req.isAuthenticated()) {

        Campground.findById(req.params.id, (err, campground) => {

            if(err) {
                console.log(err);
                res.redirect("back");

            } else {

                if(campground.author.id.equals(req.user._id)) {
                    next();

                } else  {
                    res.redirect("back");
                }
            }

        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
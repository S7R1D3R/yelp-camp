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
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground = {
        name: name,
        image: image,
        description: description
    }

    Campground.create(newCampground, function(err, campground) {

        if(err) {
            console.log(err)
        
        } else {
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


// Middleware
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {

        return next();
    }

    res.redirect("/login");
}

module.exports = router;
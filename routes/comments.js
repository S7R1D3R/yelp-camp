var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// Comments - New
router.get("/new", isLoggedIn, (req, res) => {

    // Find Campground by ID
    Campground.findById(req.params.id, function(err, campground) {

        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments - Create
router.post("/", isLoggedIn, (req, res) => {

    // Lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {

        if(err) {

            console.log(err);
            res.redirect("/campgrounds");

        } else {

            Comment.create(req.body.comment, (err, comment) => {

                if(err) {

                    console.log(err);

                } else {
                    // Add Username and ID to Comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save the comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    // Create New comment

    // Connect new comment to campground

    // redirect campground
});

// Middleware
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {

        return next();
    }

    res.redirect("/login");
}

module.exports = router;
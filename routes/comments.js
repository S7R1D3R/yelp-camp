var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// Comments - New
router.get("/new", middleware.isLoggedIn, (req, res) => {

    // Find Campground by ID
    Campground.findById(req.params.id, function(err, campground) {

        if(err || !campground) {
            console.log(err);
            req.flash("error", "Comment not found.");
            
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments - Create
router.post("/", middleware.isLoggedIn, (req, res) => {

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
    });
    // Create New comment

    // Connect new comment to campground

    // redirect campground
});

// EDIT - Edit the content of a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    
    Comment.findById(req.params.comment_id, (err, comment) => {

        if(err) {
            console.log(err);
            res.redirect("back");

        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    })
});

// UPDATE - Put request to update the comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {

        if(err) {
           res.redirect("back");

        } else {
            req.flash("success", "You updated your comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - Route to delete the comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {

    Comment.findByIdAndRemove(req.params.comment_id, (err) => {

        if(err) {
           console.log(err);
           res.redirect("back");

        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
// All the middleware comes here...
var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {

    if(req.isAuthenticated()) {

        return next();
    }

    req.flash("error", "Please login first.");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {

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

middlewareObj.checkCommentOwnership = function(req, res, next) {

    if(req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, (err, comment) => {

            if(err) {
                console.log(err);
                res.redirect("back");

            } else {

                if(comment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj
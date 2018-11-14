var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// Root Route
router.get("/", function(req, res) {

    res.render("landing");
});

// ===========================
//      Auth Routes
// ===========================

// Show register form
router.get("/register", (req, res) => {
    
    res.render("register");
});

// Handle Sign Up Logic
router.post("/register", (req, res) => {

    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, (err, user) => {

        if(err) {

            req.flash("error", err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
router.get("/login", (req, res) => {
    
    res.render("login");
});

// Does the Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"

    }), (req, res) => {

});

// Logout Logic
router.get("/logout", (req, res) => {

    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/campgrounds");
})

module.exports = router;
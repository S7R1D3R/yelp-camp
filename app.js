// ==================================
//      Modules
// ==================================
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),

// ==================================
//      Models
// ==================================
    User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),

    // Seed the DB
    seedDb = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDb();

// =================================
//      Passport Configuration
// =================================

app.use(require("express-session")({
    
    secret: "atgestrWSTJRWTrwaoykjhret23458246943qjgasygjzsdfysr5643kj6",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// =================================
//      Routes
// =================================

// ROOT - landing.ejs this is the home page
app.get("/", function(req, res) {

    res.render("landing");
});

// INDEX - index.js
app.get("/campgrounds", (req, res) => {

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
app.post("/campgrounds", (req, res) => {

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
app.get("/campgrounds/new", (req, res) => {

    res.render("campgrounds/new");
});

// SHOW - Page to show all the details about the campground
app.get("/campgrounds/:id", function(req, res) {

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

// =========================
// COMMENTS ROUTES
// =========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {

    // Find Campground by ID
    Campground.findById(req.params.id, function(err, campground) {

        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {

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

// ===========================
//      Auth Routes
// ===========================

// Show register form
app.get("/register", (req, res) => {
    
    res.render("register");
});

// Handle Sign Up Logic
app.post("/register", (req, res) => {

    var newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, (err, user) => {

        if(err) {

            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req, res, () => {
            campgrounds
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
app.get("/login", (req, res) => {
    
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"

    }), (req, res) => {

});

// Logout Logic
app.get("/logout", (req, res) => {

    req.logout();
    res.redirect("/campgrounds");
})

// ==============================
//      Middleware
// ==============================

function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {

        return next();
    }

    res.redirect("/login");
}

app.listen(3000, "localhost", () => {

    console.log("The server is listening...");
});
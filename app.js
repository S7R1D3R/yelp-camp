// ==================================
//      Modules
// ==================================
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),

// ==================================
//      Models
// ==================================
    User            = require("./models/user"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),

// ==================================
//      Routes
// ==================================
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),

    // Seed the DB
    seedDb           = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");

// =================================
//      Express Configuration
// =================================
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDb(); // seed the database

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


// ======================================
//      Routes
// ======================================
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);





app.listen(3000, "localhost", () => {

    console.log("The server is listening...");
});
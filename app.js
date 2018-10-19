var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
    {
        name: "Nova Festa",
        image: "https://farm4.staticflickr.com/3048/2855164201_ed96631ae2.jpg",
        description: "The best campground in the whole world! Nova Festa is here to stay."

    }, function(err, campground) {
        
        if(err) {
            console.log(err)
        } else {
            console.log("Newly created campground: \n" + campground)
        }
    }
);

app.get("/", function(req, res) {

    res.render("landing");
});


app.get("/campgrounds", (req, res) => {

    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {

        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
        }
    });

});

// It's a restful convention to save the post request to create a campground in the same path that where you see them
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

// CREATE - Form to create a new campground
app.get("/campgrounds/new", (req, res) => {

    res.render("new.ejs");
});

// SHOW - Page to show all the details about the campground
app.get("/campgrounds/:id", function(req, res) {

    // Find the campground with provided ID
    Campground.findById(req.params.id, function(err, campground) {

        if(err) {
            console.log(err)
        } else {

            // Render the show template
            res.render("show", {campground: campground});
        }
    });
}),

app.listen(3000, "localhost", () => {

    console.log("The server is listening...");
});
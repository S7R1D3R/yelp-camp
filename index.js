var campgrounds = [
        {name: "Mil Fontes", image: "https://farm4.staticflickr.com/3048/2855164201_ed96631ae2.jpg"},
        {name: "Amareleja", image: "https://farm4.staticflickr.com/3888/15016796272_18ba446fc0.jpg"},
        {name: "Monargil", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg"}
    ];

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {

    res.render("landing");
});


app.get("/campgrounds", (req, res) => {

    res.render("campgrounds", {campgrounds: campgrounds});
});

// It's a restful convention to save the post request to create a campground in the same path that where you see them
app.post("/campgrounds", (req, res) => {

    // Get data from form and add to campgrounds
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {
        name: name,
        image: image
    }
    campgrounds.push(newCampground);

    // Redirect to campgrounds
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {

    res.render("new.ejs");
});

app.listen(3000, "localhost", () => {

    console.log("The server is listening...");
});
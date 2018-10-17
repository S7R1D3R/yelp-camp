var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {

    res.render("landing");
});


app.get("/campgrounds", function(req, res) {

    var campgrounds = [
        {name: "Mil Fontes", image: "https://farm4.staticflickr.com/3048/2855164201_ed96631ae2.jpg"},
        {name: "Amareleja", image: "https://farm4.staticflickr.com/3888/15016796272_18ba446fc0.jpg"},
        {name: "Monargil", image: "https://farm3.staticflickr.com/2255/1660066574_f373e4fe97.jpg"}
    ];

    res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(3000, "localhost", () => {

    console.log("The server is listening...");
});
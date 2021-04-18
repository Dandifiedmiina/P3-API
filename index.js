const { Decimal128 } = require("bson");
const { Int32 } = require("bson");
var express = require("express");
var app = express();
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var list = require("./task.json");

// set view engine ejs
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public/"));

// parse url-encoded bodies (html forms);
app.use(
  express.urlencoded({
    extended: true,
  })
);

// parse json
app.use(express.json());

// connect to mongodb
var url = "mongodb+srv://miinaDB:2020Mongo@cluster0.5lbl3.mongodb.net/sample_airbnb";


// Yhdistetään tietokantaan
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

var database = mongoose.connection;

database.on("error", function () {
  console.log("Can not connect to Mongoose!");
});

database.on("open", function () {
  console.log("Connected to Mongoose!");
});

// configure schema
const Airbnb = mongoose.model(
  "listing",
  {
    id: String,
    name: String,
    summary: String,
    room_type: String,
  },
  "listingsAndReviews"
);


// homepage
app.get("/", (req, res) => {
  res.render("pages/index", list);
});

// api routing, Get All -page

app.get("/api/getall", (req, res) => {
 
  Airbnb.find({}, null, { limit: 10 }, function (err, results) {
    res.status(200).json(results);
  });
});

// get a single bnb by id
app.get("/api/:id", (req, res) => {
  Airbnb.find({_id: req.params.id}, function(err, results){
    req.json(results);
  })
});

// add a document to the database
app.post("/api/add", (req, res) => {

  var newlisting = new Airbnb({
    name: req.body.name,
    address: req.body.address,
    summary: req.body.summary,
    room_type: req.body.room_type,
    
  });

  newlisting.save(function(err, result) {
    console.log("Lisätty " + req.body.name);
  })
});

app.get("/api/:name", (req, res) => {
    Airbnb.find({name: req.params.name}, function(err, results){
      console.log("Haettu " + req.params.name);
    })
  });


app.listen(PORT);

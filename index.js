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
var url = "mongodb+srv://miinaDB:2020Mongo@cluster0.5lbl3.mongodb.net/events";

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
const Event = mongoose.model(
  "New Event",
  {
    name: String,
    type: String,
    id: String,
    test: Boolean,
    url: String,
    locale: Number,
  },
  "events"
);


// homepage
app.get("/", (req, res) => {
  res.render("pages/index", list);
});

// add -page
app.get("/add", (req, res) => {
  res.render("pages/add.ejs");
});

// api routing, Get All -page

app.get("/api/getall", (req, res) => {
 
  Event.find({}, function (err, results) {
    res.status(200).json(results);
  });
});

// get a single Event by id
app.get("/api/:id", (req, res) => {
  Event.find({_id: req.params.id}, function(err, results){
    req.json(results);
  })
});

// add a document to the database
app.post("/api/add", (req, res) => {
  // get all data from the api call
  let type = req.body.type;
  let address = req.body.address;
  let area = req.body.area;
  let room_count = req.body.room_count;
  let rent = req.body.rent;

  const new_apartment = new Apartment({
    type: type,
    address: address,
    area: area,
    room_count: room_count,
    rent: rent,
  });

  new_apartment.save().then(() => res.send("New Apartment Added!"));
});

app.put("/api/update/:id", (req, res) => {
  let id = req.params.id;

  // get all data from the api call
  let update = {
    rent: req.body.rent,
  };
  let options = {};

  console.log(update.rent);

  Apartment.findByIdAndUpdate(id, update, options, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).json("An error occured");
    } else {
      res.status(200).json("Apartment Updated!");
    }
  });
});

app.delete("/api/delete/:id", (req, res) => {
  let id = req.params.id;

  Apartment.findByIdAndDelete(id, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).json("Deleting failed");
    } else if (results == null) {
      res.status(200).json("Couldn't find an entry with given ID");
    } else {
      res.status(200).json("Deleted apartment!");
    }
  });
});

app.listen(PORT);

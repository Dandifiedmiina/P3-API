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
var url = "mongodb+srv://miinaDB:2020Mongo@cluster0.5lbl3.mongodb.net/sample_training";


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
const Company = mongoose.model(
  "company",
   {
    name: String,
    homepage_url: String,
    founded_year: Number,
    email_address: String,
  },
  "companies"
);


// homepage
app.get("/", (req, res) => {
  res.render("pages/index", list);
});

// api routing, Get All -page

app.get("/api/getall", (req, res) => {
 
  Company.find({}, null, { limit: 10 }, function (err, results) {
    res.status(200).json(results);
  });
});

// get a single company by id
app.get("/api/:id", (req, res) => {
  var _id = mongoose.Types.ObjectId(req.params.id);

  Company.findOne({_id:req.params.id}, function(err, results){
    console.log(err);
    res.status(200).json(results);
  })
});

// add a new company to the database
app.post("/api/add", (req, res) => {

  var newCompany = new Company({
    name: req.body.name,
    homepage_url: req.body.homepage_url,
    founded_year: req.body.founded_year,
    email_address: req.body.email_address,
    
  });
  //save the company info
  newCompany.save(function(err, result) {
    if (err) console.log(err);
    //log what has been saved
    console.log("Lisätty " + result);
  })
});
//Update company info by ID
app.put("/api/update/:id", function (req, res) {
  Company.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, todo) => {
    if (err) return res.status(500).send(err);
  })
  res.send("Muokataan " + req.params.id + " id:llä tietoja");
});

//Delete Company by ID
app.delete("/api/delete/:id", function (req, res) {

  // Poimitaan id talteen
  var id = req.params.id;
  
  //find company or log error 
  Company.findByIdAndDelete(id, function (err, results) {
    if (err) {
      console.log(err);
      res.json("virhe.", 500);
    } else if (results == null) {
      res.json("Poistetavaa ei löydy", 200);
    } else {
      console.log(results);
      res.json("Deleted " + id + " " + results.name, 200);
    }
  });
});

//find company by name for testing
app.get("/api/name/:name", (req, res) => {
    Company.find({name: req.params.name}, function(err, results){
      console.log("Haettu " + req.params.name);
      res.json(results);
    })
  });


app.listen(PORT);

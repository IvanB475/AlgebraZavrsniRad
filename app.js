const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require('body-parser');

const usersRoutes = require("./routes/users");

const usersControllers = require("./controllers/users");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(usersRoutes);
app.use(usersControllers);

app.get("/", (req, res) => {
  res.send("Hello");
});

mongoose.connect("mongodb://localhost:27017/zavrsnirad", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("success");
});

app.listen(8000, console.log("server started"));

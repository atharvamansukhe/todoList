const express = require("express");
 const https = require("https");
let listItems = [];
const app = express();
 app.use(express.urlencoded());
 app.use(express.static("public"));
app.set("view engine", "ejs");



app.get("/", function(req, res) {

  let today = new Date();
  let currentDay = today.getDay();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  let day = today.toLocaleDateString("en-us", options);

  res.render("list", {
    kindOfDay: day,
    newListItem: listItems
  })

});

 app.post("/", function(req, res){
let item = req.body.todoListItem;

listItems.push(item);

  res.redirect("/");
 })

app.listen(3000, function() {
  console.log("server is running");
})

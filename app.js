const express = require("express");
 const https = require("https");
 const date = require(__dirname +"/date.js");

 const app = express();

const listItems = [];
const workItems = [];

 app.use(express.urlencoded({extended:true}));
 app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {

const day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItem: listItems
  })

});

 app.post("/", function(req, res){

const item = req.body.todoListItem;

if(req.body.list === "Work") {
  workItems.push(item);
  res.redirect("/work");
}
else {
  listItems.push(item);
  res.redirect("/");
}

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItem: workItems});
})

app.post("/work", function(req,res){

  const item = req.body.todoListItem;
  workItems.push(item);
  res.redirect("/work");
})

app.get("/about", (req,res) => {
  res.render("about");
});

app.listen(3000, function() {
  console.log("server is running");
})

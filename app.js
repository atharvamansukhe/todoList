//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-atharva:atharva17@cluster0.xtqlg.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema ({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});
const item2 = new Item ({
  name: "Press the + button to add a new item."
});
const item3 = new Item ({
  name: "<-- Press this to remove an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Item.deleteMany({_id:"604ce0ce41652853889fb70f"}, (err)=> {
//   if(err){
//     console.log(err);
//   }
//   else {
//   console.log("removed succesfully");
//   }
// });


app.get("/", function(req, res) {

Item.find({}, (err, foundItems)=> {
  if(foundItems === 0) {
    Item.insertMany(defaultItems, (err)=> {
      if(err){
        console.log(err);
      }
      else {
      console.log("Added succesfully");
      }
    });
    res.redirect("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
});
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
const listName = req.body.list;

const item = new Item ({
  name: itemName
});

if(listName === "Today"){
  item.save();
  res.redirect("/");
}
else {
  List.findOne({name: listName}, (err, foundList)=> {
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  });
}
});

app.post("/delete", (req,res)=> {
  const checkedItemId = req.body.checkbox;
const listName = req.body.listName;

if(listName === "Today") {
  Item.findByIdAndRemove(checkedItemId, (err)=>{
    if(!err){
      console.log("Removed succesfully");
        res.redirect("/");
    }
  });
} else {

List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=> {
  if(!err){
    res.redirect("/" + listName);
  }
});

}

});

app.get("/:postId", function(req,res){
  const requestedTitle = _.capitalize(req.params.postId);


List.findOne({name : requestedTitle}, (err, results)=>{
  if(!err) {
    if(!results){
      //Create a new List
      const list = new List({
        name: requestedTitle,
        items: defaultItems
      });

   list.save();
   res.redirect("/"+ requestedTitle);
    } else {
      //Show existing list
      res.render("list", {listTitle: results.name, newListItems: results.items});
    }
  }
});
  });


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

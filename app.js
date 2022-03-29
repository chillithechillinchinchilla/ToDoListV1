const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const items=["Get work done."];
const workItems=[]; //in JS, const will allow push, but cannot change individual values.
// Use EJS as the view engine. Required to work.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //allow public folder

// res.render is an EJS functionallity
// look for list.ejs within views folder. Pass in the variable kindOfDay, with the value of var day.
// Some will use the same var name for app.js being passed to ejs. res.render('list', {day: day});
app.get("/", function(req,res){

  //let day = date.getDay(); //return just the current day.
  const day = date.getDate(); // date() is the module export from date.js

  //kindOfDay var must match the var in list.ejs
  res.render('list', {listTitle: day, newListItems: items});

});

// Parse through the post req from list.EJS
// Set server item to the newItem from the post input name

// Send out the newListItem with value of "item" AKA value ofreq.body.newItem
// When a post is made, the var item is updated, and the page redirects back to the app.get("/") above.
// This causes the page to update with the new values.
// We check if the new item came from work or from the home route, and post accodingly.
app.post("/", function(req,res){

  const item = req.body.newItem;
  console.log(req.body.listButton);

  if (req.body.listButton === "Work"){
    workItems.push(item);
    res.redirect("/work");
    } else {
    items.push(item);
    res.redirect("/" );
  }

});


//add separate list at the /work route
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

//add post method to /work route
app.post("/work", function(req,res){
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.get("/about", function(req,res){
    res.render("about");
});



// Listen on port 3000
app.listen(3000, function(){
  console.log("Server started at port 3000");
});

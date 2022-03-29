const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let items=[];

// Use EJS as the view engine. Required to work.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// res.render is an EJS functionallity
// look for list.ejs within views folder. Pass in the variable kindOfDay, with the value of var day.
// Some will use the same var name for app.js being passed to ejs. res.render('list', {day: day});
app.get("/", function(req,res){

    let today = new Date(); // Get date.

    let options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    };

    let day = today.toLocaleDateString("en-US", options); //use built in function locale date string

    //kindOfDay var must match the var in list.ejs
    res.render('list', {kindOfDay: day, newListItems: items});

});

// Parse through the post req from list.EJS
// Set server item to the newItem from the post input name
// log it to hyper for fun.
// Send out the newListItem with value of "item" AKA value ofreq.body.newItem
// When a post is made, the var item is updated, and the page redirects back to the app.get("/") above.
// This causes the page to update with the new values.
app.post("/", function(req,res){
  let item = req.body.newItem
  console.log(req.body.newItem);

  items.push(item);

  res.redirect("/"); //

});




// Listen on port 3000
app.listen(3000, function(){
  console.log("Server started at port 3000");
});

//test
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

//OLD arrays used for holding data
// const items=["Get work done."];
// const workItems=[]; //in JS, const will allow push, but cannot change individual values.


// Use EJS as the view engine. Required to work.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //allow public folder

// Mongoose, make connection, set schema, create model from schema
mongoose.connect("mongodb+srv://mgrimsley:passwordOne@cluster0.l5lsg.mongodb.net/todolistDB")
//mongoose.connect("mongodb://localhost:27017/todolistDB")


//create Scheme for initital db
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', itemsSchema); // Create model. 'Item'' needs to be in singular form.



// Mongoose create some default values to have stored.
const item1 = new Item({
  name: "Get some work done bro."
});
const item2 = new Item({
  name: "Focus on the nice things."
})
const item3 = new Item({
  name: "Make some new plans."
})
const item4 = new Item({
  name: "end of custom list"
})
const defaultItems = [item1, item2, item3];
const defaultCustomItems = [item1, item2, item3, item4];


const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model('List', listSchema);


// Use Mongoose to insert the array of items
// Commeted out so that it will not insert doubles.
// Item.insertMany(defaultItems, function(err){
//   if (err){
//     console.log(err);
//   }  else {
//     console.log("Updated many");
//   }
// });


// res.render is an EJS functionallity
// look for list.ejs within views folder.
// if there are not items in the list DB, insert the default list from defaultsItems arrays
// If the db is already populated, load the normal stuff.
// IF this was run locally, you could comment out the insert many and avoid the if statement.
// But when stored on a remote server like heroku, this is not easy to do. so we add the if statement.
app.get("/", function(req,res){

  Item.find({}, function(err, foundItems){
      if (foundItems.length == 0 ){
          Item.insertMany(defaultItems, function(err){
            if (err){
              console.log(err);
            }  else {
              console.log("Updated many");
            }
          });
          res.redirect("/");
      } else {
          res.render('list', {listTitle: "Today", newListItems: foundItems})
      }
  });
});

// Express route parameter so that if user types custom URL, a new list will be made for that page.
app.get("/:customListName", function(req,res){
  // Add lodash for custom lists to make /home /Home and /HOME all the same list
  const customListName = _.capitalize(req.params.customListName);

  //need to check if this list exists already, if so, we shouldnt create a new list.
  List.findOne({name: customListName}, function(err, foundList){
    if (err){console.log(err);}
    if (!foundList){
      // Create new list if nothing matches
      console.log("Nothing Found, creating list");
      // List.create({
      //   name: customListName,
      //   items: defaultCustomItems
      // });
      const list = new List({
        name: customListName,
        items: defaultCustomItems
      });
      list.save(function(){
        res.redirect("/" + customListName);
      }); //this line ensures the save is complete before the redirect, preventing mulitple saves


    }
    else{
      // Show an existing list pass EJS arguments to list.ejs page
      console.log("Found the list: " + customListName);
      res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
    }
  });
});


// Parse through the post req from list.EJS
// Set server item to the newItem from the post input name
// Send out the newListItem with value of "item" AKA value ofreq.body.newItem
// When a post is made, the var item is updated, and the page redirects back to the app.get("/") above.
// This causes the page to update with the new values.
// We check if the new item came from work or from the home route, and post accodingly.
//this will handle post from any dynamic ejs page.
app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.listButton; //.listButton correspondes to the button name, which has a value of listTitle
  //create the object to pass into db
  const itemToAdd = new Item({
    name: itemName
  });

  // if on today page, save and refresh, else we need to search for the correct list and update.
  if (listName === "Today"){
    Item.create({ name: itemName });
    res.redirect("/" );
    } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(itemToAdd);
      foundList.save(function(){
        res.redirect("/" + listName);
      });
    });

  } //end if else
});

//To delete a checkbox
app.post("/delete", function(req,res){
    //console.log(req.body.checkbox);
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
      Item.findByIdAndRemove(checkedItem, function(err){
        if(!err){
          console.log("Deleted the check item.");
        }
      });
      res.redirect("/" );
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
        // Pull from our items array (in customlist) and find the matching _id
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }

});




//add separate list at the /work route
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

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

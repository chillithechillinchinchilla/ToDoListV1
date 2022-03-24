const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Use EJS as the view engine. Required to work.
app.set('view engine', 'ejs');

//Sends 'Hello' when user tries to access home route.
// Will create a response based on date being weekday or weekend.
// getDay() returns number 1-7 for the day of the week. Sunday = 0  monday = 1
// res.render is an EJS functionallity
// look for list.ejs within views folder. Pass in the variable kindOfDay, with the value of var day.
// Some will use the same var name for app.js being passed to ejs. res.render('list', {day: day});
app.get("/", function(req,res){

    var today = new Date(); // Get date.
    var currentDay = today.getDay(); // Get day returns 1-7 forday of week. Sunday = 0
    var day = ""; // Set blank string that wil be updated based on day.

    switch (currentDay){
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Humpday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      default:
        console.log("Error: Laws of time have been broken and no day was found.");
    };

    res.render('list', {kindOfDay: day}); //kindOfDay var must match the var in list.ejs

});

// Listen on port 3000
app.listen(3000, function(){
  console.log("Server started at port 3000");
});

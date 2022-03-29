// Will use node.js modules functionality in order to return values backto app.js
// We will use the anonymous js function deleclarations
// nodeJS has an export shortcut. from modules.exports to just exports.
exports.getDate = function() {

  const today = new Date(); // Get date from js library

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options); //use built in function locale date string

};

exports.getDay = function() {

  const today = new Date(); // Get date from js library

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options); //use built in function locale date string

};

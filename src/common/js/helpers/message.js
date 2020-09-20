require("./NameSpace.js");
require("./constant.js");

helpers.message = helpers.message || function(target, name) {
  try {
    helpers.constant(target, name, "e" + Date.now() + "" + helpers.message.id++);
  } catch (e) {
    console.log("ERROR", name);
  }
};
helpers.message.id = 0;

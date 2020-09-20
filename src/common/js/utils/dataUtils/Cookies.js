require("../../helpers/createClass.js");
require("../../helpers/isEmpty.js");
require("../../helpers/constant.js");

require("../NameSpace.js");

ASJSUtils.Cookies = {};
helpers.constant(ASJSUtils.Cookies, "createCookie", function(n, v, d) {
  if ( d ) {
    var date = new Date();
        date.setTime(date.getTime() + (d * 86400000));
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";
  document.cookie = n + "=" + v + expires + "; path=/";
  try {
    !helpers.isEmpty(Storage) && localStorage.setItem(n, v);
  } catch (e) {
    console.log(e);
  }
});
helpers.constant(ASJSUtils.Cookies, "readCookie", function(n) {
  var nameEQ = n + "=";
  var ca = document.cookie.split(';');
  var i = -1;
  var l = ca.length;
  while (++i < l) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  try {
    if (!helpers.isEmpty(Storage)) return localStorage.getItem(n);
  } catch (e) {
    console.log(e);
  }
  return null;
});
helpers.constant(ASJSUtils.Cookies, "eraseCookie", function(n) {
  _scope.createCookie(n, "", -1);
  try {
    !helpers.isEmpty(Storage) && localStorage.removeItem(n);
  } catch (e) {
    console.log(e);
  }
});

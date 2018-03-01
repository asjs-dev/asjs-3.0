var URLParser = createSingletonClass(
"URLParser",
ASJS.BaseClass, 
function(_scope) {
  var _urlParams;
  
  _scope.getQueryParam = function(param) {
    if (!_urlParams || !_urlParams[param]) {
      var queryParams = decodeURIComponent(location.href);
      var qmi = queryParams.indexOf("?");
      var params = queryParams.substring(qmi + 1).split("&");
      _urlParams = {};
      var line;
      while (line = params.shift()) {
        var sline = line.split("=");
        _urlParams[sline[0]] = sline[1];
      }
    }
    return _urlParams[param];
  }
  
  _scope.parseURL = function() {
    return decodeURIComponent(location.href).split("/");
  }
});

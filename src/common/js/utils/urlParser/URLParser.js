require("../../NameSpace.js");

createSingletonClass(ASJSUtils, "URLParser", ASJS.BaseClass, function(_scope) {
  var _urlParams;

  _scope.getQueryParams = function() {
    return _urlParams;
  }

  _scope.getQueryParam = function(param) {
    parseQueryString();
    return _urlParams[param];
  }

  _scope.parseURL = function() {
    return decodeURIComponent(location.href).split("/");
  }

  _scope.createUrlParams = function(params, reload) {
  	var url = "";
  	for (var k in params) {
  		if (url !== "") url += "&";
  		url += k + "=" + params[k];
  	}

    var newUrl = window.location.href.split("?")[0] + "?" + url;
  	if (reload) window.location.href = newUrl;
    else window.history.pushState("", "", newUrl);
  };

  function parseQueryString() {
    if (!_urlParams) {
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
  }
});

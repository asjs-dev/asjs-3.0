require("../../NameSpace.js");

createSingletonClass(ASJSUtils, "URLParser", BaseClass, function(_scope) {
  var _latestUrl = null;
  var _params    = null;
  
  _scope.getUrlParams = function() {
    return parseUrl();
  }

  _scope.getQueryParams = function() {
    return parseUrl().query;
  }

  _scope.getHashParams = function() {
    return parseUrl().hash;
  }

  _scope.getQueryParam = function(param) {
    return _scope.getQueryParams[param];
  }

  _scope.getHashParam = function(param) {
    return _scope.getHashParams[param];
  }

  _scope.getParsedPath = function() {
    return parseUrl().base.split("/");
  }

  _scope.setUrlParams = function(params, reload) {
    var newUrl = params.base;

    if (Object.keys(params.query).length > 0) newUrl += "?" + createQueryString(params.query);
    if (Object.keys(params.hash).length > 0) newUrl += "#" + createQueryString(params.hash);

  	if (reload) window.location.href = newUrl;
    else window.history.pushState("", "", newUrl);
  };

  _scope.setQueryParams = function(queryParams, reload) {
    var params = parseUrl();
        params.query = queryParams;
    _scope.setUrlParams(params, reload);
  };

  _scope.setHashParams = function(hashParams, reload) {
    var params = parseUrl();
        params.hash = hashParams;
    _scope.setUrlParams(params, reload);
  };

  function createQueryString(params) {
    var queryString = "";
    for (var k in params) queryString += (queryString !== "" ? "&" : "") + k + "=" + params[k];
    return queryString;
  }

  function parseUrl() {
    if (_params === null || _latestUrl !== decodeURIComponent(location.href)) {
      _latestUrl = decodeURIComponent(location.href);

      _params = {
        "base"  : "",
        "hash"  : {},
        "query" : {}
      };

      var type = "base";
      var key = "";
      var isArray = false;
      var parsed = _latestUrl.split(/([\?#=&])/g);
      for (var i = 0, l = parsed.length; i < l; ++i) {
        var item = parsed[i];
        var isLast = i + 1 >= l;
        if (["&", "?", "#"].indexOf(item) > -1 && !isLast) {
          if (item === "?") type = "query";
          else if (item === "#") type = "hash";
          if (type !== "base") {
            key = parsed[++i];
            isArray = key.length >= 3 && key.indexOf("[]") === key.length - 2;
            if (isArray) key = key.slice(0, key.length - 2);
          }
        } else if (type === "base") _params[type] += item;
        else if (item === "=" && !isLast) {
          if (isArray) {
            if (_params[type][key] === undefined) _params[type][key] = [];
            _params[type][key].push(parsed[++i]);
          } else _params[type][key] = parsed[++i];
        }
      }
    }

    return clone(_params);
  }
});

require("../../NameSpace.js");

createSingletonClass(ASJSUtils, "Facebook", ASJS.Sprite, function(_scope, _super) {
  var _facebookAppId;
  var _version;

  _scope.new = function(facebookAppId, version) {
    _super.new();
    _scope.setAttr("id", "fb-root");
    stage.addChild(_scope);

    _facebookAppId = facebookAppId;
    _version = version;

    var script = new ASJS.Tag('script');
        script.setAttr("type",  "text/javascript");
        script.setAttr("async", "true");
        script.setAttr("src",   document.location.protocol + '//connect.facebook.net/en_US/all.js');
    _scope.addChild(script);

    window.fbAsyncInit = onFBAsyncInit;
  }

  _scope.login = function() {
    FB.login(onLoginStatus);
  }

  _scope.logout = function() {
    FB.getLoginStatus(onGetLoginStatus);
  }

  _scope.postToFeed = function(title, desc, url, imageUrl) {
    var obj = {
      method: 'feed',
      link: url,
      picture: imageUrl,
      name: title,
      description: desc
    };
    FB.ui(obj, onPostFeed);
  }

  function onPostFeed(response) {
    _scope.dispatchEvent(ASJSUtils.Facebook.POST_COMPLETE, response);
  }

  function onLogout(response) {
    _scope.dispatchEvent(ASJSUtils.Facebook.LOGOUT);
  }

  function onGetLoginStatus(response) {
    if (response.status === "connected") FB.logout( onLogout);
    else _scope.dispatchEvent(ASJSUtils.Facebook.LOGOUT);
  }

  function onFBAsyncInit() {
    var obj = {
      appId: _facebookAppId,
      status: true,
      cookie: true,
      xfbml: true,
      oauth: true,
      version: (_version || 'v2.4')
    };
    FB.init(obj);
    FB.getLoginStatus(onLoginStatus);
  }

  function onLoginStatus(response) {
    switch (response.status) {
      case "connected":      _scope.dispatchEvent(ASJSUtils.Facebook.CONNECTED, response.authResponse);
      break;
      case "not_authorized": _scope.dispatchEvent(ASJSUtils.Facebook.NOT_AUTHORIZED);
      break;
      case "unknown":        _scope.dispatchEvent(ASJSUtils.Facebook.UNKNOW);
      break;
    }
  }
});
msg(ASJSUtils.Facebook, "CONNECTED");
msg(ASJSUtils.Facebook, "NOT_AUTHORIZED");
msg(ASJSUtils.Facebook, "UNKNOW");
msg(ASJSUtils.Facebook, "LOGOUT");
msg(ASJSUtils.Facebook, "POST_COMPLETE");

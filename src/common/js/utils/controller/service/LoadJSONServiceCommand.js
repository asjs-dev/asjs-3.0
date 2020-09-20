require("../../../helpers/createClass.js");

require("../../NameSpace.js");

helpers.createClass(ASJSUtils, "LoadJSONServiceCommand", ASJS.AbstractCommand, function(_scope, _super) {
  var _dfd    = new ASJS.Promise();
  var _loader = new ASJS.Loader();

  _scope.new = function() {
    _loader.responseType = "json";
    _loader.compressed   = true;
    _loader.method       = ASJS.RequestMethod.GET;

    _loader.addEventListener(ASJS.LoaderEvent.LOAD, onLoad);
    _loader.addEventListener(ASJS.LoaderEvent.ERROR, onError);
  }

  _scope.execute = function(url) {
    _loader.load(url + "?v={{date}}");
    return _dfd;
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _loader.destruct();
    _dfd.destruct();

    _loader =
    _dfd    = null;

    _super.destruct();
  }

  function onLoad() {
    _dfd.resolve(_loader.content);
    _scope.destruct();
  }

  function onError() {
    _dfd.reject(_loader.content);
    _scope.destruct();
  }
});

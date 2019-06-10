require("../../NameSpace.js");

createClass(ASJSUtils, "LoadJSONServiceCommand", ASJS.AbstractCommand, function(_scope) {
  _scope.execute = function(url) {
    var dfd = new ASJS.Promise();

    var loader = new ASJS.Loader();
        loader.responseType = "json";
        loader.compressed   = true;
        loader.method = ASJS.RequestMethod.GET;
        loader.addEventListener(ASJS.LoaderEvent.LOAD, function(e) {
          dfd.resolve(loader.content);
          loader.unload();
        });
        loader.addEventListener(ASJS.LoaderEvent.ERROR, function(e) {
          dfd.reject(loader.content);
          loader.unload();
        });
        loader.load(url + "?v={{date}}");

    return dfd;
  }
});

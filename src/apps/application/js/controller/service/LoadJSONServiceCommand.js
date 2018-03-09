var LoadJSONServiceCommand = createClass(
"LoadJSONServiceCommand",
ASJS.AbstractCommand,
function(_scope) {
  _scope.execute = function(url) {
    var dfd = new ASJS.Promise();

    var loader = new ASJS.Loader();
        //loader.responseType = "json";
        loader.compressed   = true;
        loader.method = ASJS.RequestMethod.GET;
        loader.addEventListener(ASJS.LoaderEvent.LOAD, function(e) {
          dfd.resolve(JSON.parse(loader.content));
          loader.unload();
        });
        loader.addEventListener(ASJS.LoaderEvent.ERROR, function(e) {
          dfd.reject(loader.content);
          loader.unload();
        });
        loader.load(url);

    return dfd;
  }
});

require("./GeolocationData.js");

var Geolocation = createSingletonClass(
"Geolocaton",
ASJS.EventDispatcher,
function(_scope) {
  var _location = new GeolocationData();
  var _geolocation;
  var _watchID;

  get(_scope, "location", function() { return _location; });

  _scope.start = function(enableHighAccuracy, timeout, maximumAge) {
    _scope.stop();
    if (!_geolocation) _geolocation = getGeolocation();

    if (_geolocation) {
      var obj = {
        'enableHighAccuracy': enableHighAccuracy || false,
        'timeout'           : timeout || 10000,
        'maximumAge'        : maximumAge || 60000
      }
      _watchID = _geolocation.watchPosition(setGeoDatas, errorGettingPosition, obj);
    } else errorGettingPosition({code: "not_supported"});
  }

  _scope.stop = function() {
    if (_geolocation && _watchID) _geolocation.clearWatch(_watchID);
  }

  _scope.isSupported = function() {
    return !empty(getGeolocation());
  }

  function getGeolocation() {
    return navigator.geolocation;
  }

  function setGeoDatas(position) {
    _location = new GeolocationData(position.coords);

    _scope.dispatchEvent(Geolocation.UPDATED, _location);
  }

  function errorGettingPosition(error) {
    _scope.dispatchEvent(Geolocation.ERROR, error);
  }
});
msg(Geolocation, "UPDATED");
msg(Geolocation, "ERROR");

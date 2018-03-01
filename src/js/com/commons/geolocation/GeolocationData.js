var GeolocationData = createClass(
"GeolocationData",
ASJS.BaseClass, 
function(_scope) {
  _scope.new = function(data) {
    var d = data || {};

    _scope.latitude         = d.latitude || 0;
    _scope.longitude        = d.longitude || 0;
    _scope.altitude         = d.altitude || 0;
    _scope.accuracy         = d.accuracy || 0;
    _scope.altitudeAccuracy = d.altitudeAccuracy || 0;
    _scope.heading          = d.heading || 0;
    _scope.speed            = d.speed || 0;
  }
});

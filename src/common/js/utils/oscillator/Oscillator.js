require("../../NameSpace.js");

createClass(ASJSUtils, "Oscillator", ASJS.BaseClass, function(_scope) {
  var _isPlaying = false;

  var _audioContext;
  var _analyser;
  var _sourceNode;
  var _flist;
  var _step;
  var _rafID;

  _scope.stepInterval;

  _scope.new = function() {
    _scope.stepInterval = 200;
    _audioContext = new AudioContext();
    _analyser = _audioContext.createAnalyser();
    _analyser.fftSize = 2048;
    _analyser.connect(_audioContext.destination);
  }

  _scope.play = function(flist) {
    _flist = flist;
    _scope.stop();
    _sourceNode = _audioContext.createOscillator();
    _sourceNode.connect(_analyser);
    _sourceNode.start(0);
    _isPlaying = true;
    _step = 0;
    playList();
  }

  _scope.stop = function() {
    if (_sourceNode) _sourceNode.stop(0);
    _sourceNode = null;
    _isPlaying = false;
    if (_rafID) _rafID = clearTimeout(_rafID);
  }

  function playList() {
    playFrequency(_flist[_step]);
    if (++_step >= _flist.length) _step = 0;
    _rafID = setTimeout(playList, _scope.stepInterval);
  }

  function playFrequency(frequency) {
    _sourceNode.frequency.value = frequency;
  }
});

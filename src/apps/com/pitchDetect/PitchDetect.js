require("org/commons/media/Media.js");

var PitchDetect = createClass(
"PitchDetect",
ASJS.EventDispatcher,
function(_scope) {
  var _media  = Media.instance;
  
  var _isPlaying = false;
  
  var _audioContext;
  var _analyser;

  var _rafID;
  var _bufferLength;
  var _buffer;

  var _minSamples;
  
  var _interval;
  
  _scope.new = function() {
    _scope.bufferLength = 1024;
    _scope.minSamples = 0;
    _scope.samplingInterval = 50;
    _audioContext = new AudioContext();
  }
  
  prop(_scope, "bufferLength", {
    get: function() { return _bufferLength; },
    set: function(v) {
      _bufferLength = v;
      _buffer = new Float32Array(_bufferLength);
    }
  });
  
  prop(_scope, "minSamples", {
    get: function() { return _minSamples; },
    set: function(v) { _minSamples = v; }
  });
  
  prop(_scope, "samplingInterval", {
    get: function() { return _interval; },
    set: function(v) { _interval = v; }
  });
  
  _scope.start = function() {
    _scope.stop();
    
    try {
      _media.getUserMedia({
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "false",
            "googNoiseSuppression": "false",
            "googHighpassFilter": "false"
          },
          "optional": []
        },
      }, function(stream) {
        _analyser = _audioContext.createAnalyser();
        _analyser.fftSize = 2048;
        var mediaStreamSource = _audioContext.createMediaStreamSource(stream);
          mediaStreamSource.connect(_analyser);
        _isPlaying = true;
        updatePitch();
      },
      function() {
        trace('Stream generation failed.');
      });
    } catch (e) {
      trace('getUserMedia threw exception :' + e);
    }
  }

  _scope.stop = function() {
    _analyser = null;
    _isPlaying = false;
    if (_rafID) _window.clearTimeout(_rafID);
  }
  
  function autoCorrelate() {
    var sampleRate = _audioContext.sampleRate;
    var size = _buffer.length;
    var maxSamples = Math.floor(size / 2);
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(maxSamples);

    var i = -1;
    while (++i < size) rms += Math.pow(_buffer[i], 2);

    if (Math.sqrt(rms / size) < 0.01) return -1;

    var lastCorrelation = 1;
    var offset = _minSamples - 1;
    while (++offset < maxSamples) {
      var correlation = 0;

      var i = -1;
      while (++i < maxSamples) correlation += Math.abs((_buffer[i]) - (_buffer[i + offset]));
      
      correlation = 1 - (correlation / maxSamples);
      correlations[offset] = correlation;
      if (correlation > 0.9 && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      } else if (foundGoodCorrelation) {
        var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];  
        return sampleRate / (best_offset + (8 * shift));
      }
      lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) return sampleRate / best_offset;
    return -1;
  }

  function updatePitch() {
    _analyser.getFloatTimeDomainData(_buffer);
     _scope.dispatchEvent(PitchDetect.DETECTED, autoCorrelate());
    _rafID = setTimeout(updatePitch, _interval);
  }
});
msg(PitchDetect, "DETECTED", "detected");
cnst(PitchDetect, "A", 440);
cnst(PitchDetect, "noteFromPitch", function(frequency) {
var noteNum = 12 * (Math.log(frequency / PitchDetect.A) / Math.log(2));
return Math.round(noteNum) + 69;
});
cnst(PitchDetect, "centsOffFromPitch", function(frequency, note) {
var freqFromNoteNum = PitchDetect.A * Math.pow(2, (note - 69) / 12);
return Math.floor(1200 * Math.log(frequency / freqFromNoteNum) / Math.log(2));
});

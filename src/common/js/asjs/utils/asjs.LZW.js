ASJS.LZW = createSingletonClass(
"LZW",
ASJS.BaseClass,
function(_scope) {
  _scope.compress = function(uncompressed) {
    var i;
    var dictSize = 256;
    var dictionary = [];
    for (i = 0; i < dictSize; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }
    var w = "";
    var result = [];
    for (i = 0; i < uncompressed.length; i++) {
      var c = charAt(uncompressed, i);
      var wc = w + c;
      if (!empty(dictionary[wc])) {
        w = wc;
      } else {
        result.push(dictionary[w]);
        dictionary[wc] = dictSize++;
        w = c;
      }
    }
    if (w != "") {
      result.push(dictionary[w]);
    }
    return toBinary(result);
  }

  _scope.decompress = function(compressed) {
    compressed = fromBinary(compressed);
    var i;
    var dictSize = 256;
    var dictionary = [];
    for (i = 1; i < dictSize; i++) {
      dictionary[i] = String.fromCharCode(i);
    }
    var w = String.fromCharCode(compressed[0]);
    var result = w;
    for (i = 1; i < compressed.length; i++) {
      var entry = "";
      var k = compressed[i];
      if (!empty(dictionary[k])) {
        entry = dictionary[k];
      } else if (k == dictSize) {
        entry = w + charAt(w, 0);
      } else {
        return null;
      }
      result += entry;
      dictionary[dictSize++] = w + charAt(entry, 0);
      w = entry;
    }
    return result;
  }

  function charAt(string, index){
    if(index < string.length){
      return string[index];
    } else{
      return -1;
    }
  }

  function toBinary(codes) {
    var i;
    var dictionaryCount = 256;
    var bits = 8;
    var ret = "";
    var rest = 0;
    var restLength = 0;
    for (i = 0; i < codes.length; i++) {
      var code = codes[i];
      rest = (rest << bits) + code;
      restLength += bits;
      dictionaryCount++;
      if (dictionaryCount >> bits) {
        bits++;
      }
      while (restLength > 7) {
        restLength -= 8;
        ret += String.fromCharCode(rest >> restLength);
        rest &= (1 << restLength) - 1;
      }
    }
    return ret + (restLength ? String.fromCharCode(rest << (8 - restLength)) : "");
  }

  function fromBinary(binary) {
    var i;
    var dictionaryCount = 256;
    var bits = 8;
    var codes = [];
    var rest = 0;
    var restLength = 0;
    for (i = 0; i < binary.length; i++) {
      rest = (rest << 8) + binary.charCodeAt(i);
      restLength += 8;
      if (restLength >= bits) {
        restLength -= bits;
        codes.push(rest >> restLength);
        rest &= (1 << restLength) - 1;
        dictionaryCount++;
        if (dictionaryCount >> bits) {
          bits++;
        }
      }
    }
    return codes;
  }
});

ASJS.LZW = {};
helpers.constant(ASJS.LZW, "compress", function(uncompressed) {
  uncompressed = unescape(encodeURIComponent(uncompressed));
  var i;
  var dictSize = 256;
  var dictionary = [];
  for (i = 0; i < dictSize; i++) dictionary[String.fromCharCode(i)] = i;
  var w = "";
  var result = [];
  helpers.map(uncompressed, function(i) {
    var c = ASJS.LZW.charAt(uncompressed, i);
    var wc = w + c;
    if (!helpers.isEmpty(dictionary[wc])) w = wc;
    else {
      result.push(dictionary[w]);
      dictionary[wc] = dictSize++;
      w = c;
    }
  });
  w != "" && result.push(dictionary[w]);
  return ASJS.LZW.toBinary(result);
});

helpers.constant(ASJS.LZW, "decompress", function(compressed) {
  compressed = ASJS.LZW.fromBinary(compressed);
  var i;
  var dictSize = 256;
  var dictionary = [];
  for (i = 1; i < dictSize; i++) dictionary[i] = String.fromCharCode(i);
  var w = String.fromCharCode(compressed[0]);
  var result = w;
  for (i = 1; i < compressed.length; i++) {
    var entry = "";
    var k = compressed[i];
    if (!helpers.isEmpty(dictionary[k])) entry = dictionary[k];
    else if (k === dictSize) entry = w + ASJS.LZW.charAt(w, 0);
    else return null;
    result += entry;
    dictionary[dictSize++] = w + ASJS.LZW.charAt(entry, 0);
    w = entry;
  }
  return decodeURIComponent(escape(result));
});

helpers.constant(ASJS.LZW, "charAt", function(string, index){
  return index < string.length
    ? string[index]
    : -1;
});

helpers.constant(ASJS.LZW, "toBinary", function(codes) {
  var dictionaryCount = 256;
  var bits = 8;
  var ret = "";
  var rest = 0;
  var restLength = 0;
  helpers.map(codes, function(i, code) {
    rest = (rest << bits) + code;
    restLength += bits;
    dictionaryCount++;
    if (dictionaryCount >> bits) bits++;
    while (restLength > 7) {
      restLength -= 8;
      ret += String.fromCharCode(rest >> restLength);
      rest &= (1 << restLength) - 1;
    }
  });
  return ret + (restLength ? String.fromCharCode(rest << (8 - restLength)) : "");
});

helpers.constant(ASJS.LZW, "fromBinary", function(binary) {
  var dictionaryCount = 256;
  var bits = 8;
  var codes = [];
  var rest = 0;
  var restLength = 0;
  helpers.map(binary, function(i) {
    rest = (rest << 8) + binary.charCodeAt(i);
    restLength += 8;
    if (restLength >= bits) {
      restLength -= bits;
      codes.push(rest >> restLength);
      rest &= (1 << restLength) - 1;
      dictionaryCount++;
      if (dictionaryCount >> bits) bits++;
    }
  });
  return codes;
});

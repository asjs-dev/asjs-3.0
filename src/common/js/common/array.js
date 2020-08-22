Array.prototype.addUnique = function(item) {
  this.indexOf(item) == -1 && this.push(item);
}
Array.prototype.has = function(item) {
  return this.indexOf(item) > -1;
}
Array.prototype.remove = function(item) {
  var index = this.indexOf(item);
  index > -1 && this.splice(index, 1);
}
Array.prototype.clone = function() {
  return this.slice(0);
}
Array.prototype.equal = function(arr) {
  if (!arr || arr.length !== this.length) return false;

  for (var i = 0; i < this.length; i++) {
    if (this[i] !== arr[i]) return false;
  }

  return true;
}

var arraySet = function(target, source, from) {
  var i = 0;
  var l = source.length;
  while (i < l) {
    target[from + i] = source[i];
    ++i;
  }
}

ASJS.BitwiseOperations = {};
rof(ASJS.BitwiseOperations, "add", function(a, b) {
  var partialSum;
  var carry;
  do {
    partialSum = a ^ b;
    carry = (a & b) << 1;
    a = partialSum;
    b = carry;
  } while (carry != 0);
  return partialSum;
});
rof(ASJS.BitwiseOperations, "subtract", function(a, b) {
  return ASJS.BitwiseOperations.add(a, ASJS.BitwiseOperations.add(~b, 1));
});
rof(ASJS.BitwiseOperations, "multiply", function(a, b) {
  var res = 0;
  while (b > 0) {
    if (b & 1) res = res + a;
    a = a << 1;
    b = b >> 1;
  }
  return res;
});
rof(ASJS.BitwiseOperations, "division", function(dividend, divisor) {
  var negative = false;
  if ((dividend & (1 << 31)) == (1 << 31)) {
    negative = !negative;
    dividend = ASJS.BitwiseOperations.add(~dividend, 1);
  }
  if ((divisor & (1 << 31)) == (1 << 31)) {
    negative = !negative;
    divisor = ASJS.BitwiseOperations.add(~divisor, 1);
  }
  var quotient = 0;
  var r;
  for (var i = 30; i >= 0; i = ASJS.BitwiseOperations.subtract(i, 1)) {
    r = (divisor << i);
    if (r < Number.MAX_VALUE && r >= 0) {
      if (r <= dividend) {
        quotient |= (1 << i);
        dividend = ASJS.BitwiseOperations.subtract(dividend, r);
      }
    }
  }
  if (negative) {
    quotient = ASJS.BitwiseOperations.add(~quotient, 1);
  }
  return quotient;
});

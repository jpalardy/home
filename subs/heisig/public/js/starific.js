
var starific = (function () {
  var starific = {};

  starific.matcher = function (pattern) {
    var m = pattern.match(/^(\*)?(.*?)(\*)?$/);
    var starB = m[1];
    var text  = m[2];
    var starE = m[3];
    if (starB && starE) {
      return function (str) {
        return str.indexOf(text) !== -1;
      };
    } else if (starE) {
      return function (str) {
        return str.indexOf(text) === 0;
      };
    } else if (starB) {
      return function (str) {
        var pos = str.lastIndexOf(text);
        return pos !== -1 && pos === str.length - text.length;
      };
    } else {
      return function (str) {
        return str === text;
      };
    }
  };

  starific.match = function (matchers, tokens) {
    return matchers.some(function (matcher) {
      return tokens.some(function (token) {
        return matcher(token);
      });
    });
  };

  return starific;
}());


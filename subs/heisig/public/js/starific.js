
var starific = (function () {
  var Starific = function (matchers) {
    this.matchers = matchers;
  };

  Starific.prototype.any = function (tokens) {
    return this.matchers.some(function (matcher) {
      return tokens.some(function (token) {
        return matcher(token);
      });
    });
  };

  Starific.prototype.all = function (tokens) {
    return this.matchers.every(function (matcher) {
      return tokens.some(function (token) {
        return matcher(token);
      });
    });
  };

  var matcher = function (pattern) {
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

  return function (terms) {
    if (!Array.isArray(terms)) {
      terms = terms.toLowerCase().trim().split(/\s+/);
    }
    var matchers = terms.map(matcher);
    return new Starific(matchers);
  };
}());


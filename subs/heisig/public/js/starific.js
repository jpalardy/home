(function () {
  var starific = (function () {
    var Starific = function (matchers) {
      this.matchers = matchers;
    };

    var match = function (matchers, tokens, fn) {
      var positive = matchers.positive[fn](function (matcher) {
        return tokens.some(function (token) {
          return matcher(token);
        });
      });
      var negative = matchers.negative.some(function (matcher) {
        return tokens.some(function (token) {
          return matcher(token);
        });
      });
      return positive && !negative;
    };

    Starific.prototype.any = function (tokens) {
      return match(this.matchers, tokens, 'some');
    };

    Starific.prototype.all = function (tokens) {
      return match(this.matchers, tokens, 'every');
    };

    var matcher = function (pattern) {
      var m = pattern.match(/^(\*)?(.*?)(\*)?$/);
      var starB = m[1];
      var text  = m[2];
      var starE = m[3];
      if (text === '') {
        return function () { return true; };
      }
      if (starB && starE) {
        return function (str) { return str.indexOf(text) !== -1; };
      }
      if (starE) {
        return function (str) { return str.indexOf(text) === 0; };
      }
      if (starB) {
        return function (str) {
          var pos = str.lastIndexOf(text);
          return pos !== -1 && pos === str.length - text.length;
        };
      }
      return function (str) { return str === text; };
    };

    return function (terms) {
      if (!Array.isArray(terms)) {
        terms = terms.toLowerCase().trim().split(/\s+/);
      }
      var matchers = {positive: [], negative: []};
      terms.forEach(function (term) {
        if (term.match(/^-/)) {
          matchers.negative.push(matcher(term.slice(1))); // remove '-' prefix
        } else {
          matchers.positive.push(matcher(term));
        }
      });
      if (matchers.positive.length === 0) {
        matchers.positive.push(matcher(''));
      }
      return new Starific(matchers);
    };
  }());

  if (typeof module !== 'undefined') {
    module.exports = starific;
  } else {
    this.starific = starific;
  }
}.call(this));

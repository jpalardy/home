// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({12:[function(require,module,exports) {
module.exports = [{
  alias: "g",
  name: "google",
  search: "https://www.google.com/search?q=%s"
}, {
  alias: "gt",
  name: "google translate",
  search: "https://translate.google.com/#auto|en|%s"
}, {
  alias: "gim",
  name: "google image",
  search: "https://www.google.com/search?q=%s&tbm=isch",
  visit: "https://www.google.com/imghp?tbm=isch"
}, {
  alias: "gmap",
  name: "google maps",
  search: "https://maps.google.com/maps?oi=map&q=%s"
}, {
  alias: "w3w",
  name: "what3words",
  search: "https://map.what3words.com/%s"
}, {
  alias: "gfin",
  name: "google finance",
  search: "https://www.google.com/finance?q=%s",
  visit: "https://www.google.com/finance"
}, {
  alias: "tw",
  name: "twitter",
  search: "https://twitter.com/search?q=%s"
}, {
  alias: "yt",
  name: "youtube",
  search: "https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search"
}, {
  alias: "b",
  name: "bing",
  search: "http://www.bing.com/search?q=%s"
}, {
  alias: "sh",
  name: "symbol hound",
  search: "http://symbolhound.com/?q=%s"
}, {
  alias: "wa",
  name: "wolfram alpha",
  search: "https://www.wolframalpha.com/input/?i=%s"
}, {
  alias: "ddg",
  name: "duckduckgo",
  search: "https://duckduckgo.com/?q=%s"
}, {
  alias: "wp",
  name: "wikipedia",
  search: "https://en.wikipedia.org/?search=%s"
}, {
  alias: "mw",
  name: "merriam-webster",
  search: "https://www.merriam-webster.com/dictionary/%s"
}, {
  alias: "ud",
  name: "urban dictionary",
  search: "http://www.urbandictionary.com/define.php?term=%s"
}, {
  name: "emoji",
  search: "https://emojipedia.org/search/?q=%s"
}, {
  alias: "so",
  name: "stack overflow",
  search: "http://stackoverflow.com/search?q=%s"
}, {
  alias: "cv",
  name: "cross validated",
  search: "http://stats.stackexchange.com/search?q=%s"
}, {
  alias: "am",
  name: "amazon.com",
  search: "http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s"
}, {
  alias: "am.ca",
  name: "amazon.ca",
  search: "http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s"
}, {
  name: "audible",
  search: "http://www.audible.com/search?advsearchKeywords=%s"
}, {
  name: "vpl",
  search: "http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue",
  visit: "http://www.vpl.ca/"
}, {
  alias: "bp",
  name: "bookpiles",
  search: "https://bookpiles.ca/jonathan/books?q=%s",
  visit: "https://bookpiles.ca/jonathan/books"
}, {
  name: "leanpub",
  search: "https://leanpub.com/bookstore/type/book/sort/earnings_in_last_7_days?search=%s"
}, {
  name: "ebooks-it",
  search: "https://ebooks-it.org/search-engine.htm?bform=btitle&page=1&query=%s",
  hide: true
}, {
  name: "libgen",
  search: "http://libgen.io/search.php?req=%s",
  hide: true
}, {
  name: "imdb",
  search: "http://imdb.com/find?q=%s"
}, {
  name: "yelp",
  search: "http://www.yelp.com/search?find_desc=%s"
}, {
  alias: "rt",
  name: "rotten tomatoes",
  search: "http://www.rottentomatoes.com/search/?search=%s"
}, {
  alias: "gh",
  name: "github",
  search: "https://github.com/search?q=%s",
  visit: "https://github.com/jpalardy"
}, {
  alias: "dh",
  name: "docker hub",
  search: "https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=%s&starCount=0"
}, {
  alias: "ls",
  name: "yubnub",
  search: "http://yubnub.org/kernel/ls?args=%s"
}, {
  alias: "ch",
  name: "color-hex",
  search: "http://www.color-hex.com/color/%s"
}, {
  name: "caniuse",
  search: "http://caniuse.com/#search=%s"
}, {
  alias: "ann",
  name: "anime news network",
  search: "http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s",
  hide: true
}, {
  name: "anidb",
  search: "http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist",
  hide: true
}, {
  alias: "cr",
  name: "crunchyroll",
  search: "http://www.crunchyroll.com/search?q=%s",
  hide: true
}, {
  alias: "fun",
  name: "funimation",
  search: "http://www.funimation.com/search?q=%s",
  hide: true
}, {
  alias: "nf",
  name: "netflix",
  search: "http://www.netflix.com/search/%s",
  hide: true
}, {
  name: "heisig",
  search: "http://home.jpalardy.com/heisig/#%s",
  visit: "http://home.jpalardy.com/heisig/",
  hide: true
}, {
  alias: "rd",
  name: "romajidesu",
  search: "http://www.romajidesu.com/dictionary/meaning-of-%s.html",
  hide: true
}, {
  alias: "wr",
  name: "wordreference",
  search: "http://www.wordreference.com/es/en/translation.asp?spen=%s",
  hide: true
}, {
  alias: "cnm",
  name: "cinema, vancouver",
  visit: "http://www.cinemaclock.com/bri/vancouver",
  hide: true
}, {
  alias: "fs",
  name: "fatsecret",
  search: "http://www.fatsecret.com/calories-nutrition/search?q=%s",
  visit: "http://www.fatsecret.com/calories-nutrition/",
  hide: true
}, {
  name: "meetup",
  search: "https://www.google.com/search?q=meetup+vancouver+%s",
  visit: "https://www.meetup.com"
}, {
  name: "udemy",
  search: "https://www.udemy.com/courses/search/?q=%s",
  hide: true
}].map(function (site) {
  return {
    name: site.name,
    alias: site.alias || site.name,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
    hide: Boolean(site.hide)
  };
});
},{}],8:[function(require,module,exports) {
module.exports = [{
  name: "nodejs",
  visit: "https://nodejs.org/api/"
}, {
  name: "express",
  visit: "https://expressjs.com/en/4x/api.html"
}, {
  name: "jq",
  visit: "https://stedolan.github.io/jq/manual/"
}, {
  name: "aws",
  visit: "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/"
}, {
  name: "mdn",
  search: "https://developer.mozilla.org/en-US/search?q=%s",
  visit: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference"
}, {
  name: "lodash",
  visit: "https://lodash.com/docs/"
}, {
  name: "ramda",
  visit: "http://ramdajs.com/docs/"
}, {
  name: "async",
  visit: "https://caolan.github.io/async/"
}].map(function (site) {
  return {
    name: site.name + " api",
    alias: "api." + site.name,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
    hide: true
  };
});
},{}],10:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
  function Command(site, query, url) {
    _classCallCheck(this, Command);

    this.site = site;
    this.query = query;
    this.url = url;
  }

  _createClass(Command, [{
    key: "toString",
    value: function toString() {
      return this.site.alias + " " + this.query;
    }
  }]);

  return Command;
}();

//-------------------------------------------------

module.exports = function (sites, defaultSiteName) {
  var _cheatSheet = sites.filter(function (site) {
    return !site.hide;
  }).map(function (site) {
    return site.alias + "\t" + site.name;
  });
  var LUT = sites.reduce(function (acc, site) {
    acc[site.alias] = site;
    return acc;
  }, {});

  return {
    cheatSheet: function cheatSheet(text) {
      var lines = _cheatSheet.filter(function (line) {
        return line.indexOf(text) === 0;
      });
      // match:   filtered down list
      // nomatch: _everything_
      return lines.length ? lines : _cheatSheet;
    },
    parse: function parse(text) {
      var words = text.trim().split(/ +/).filter(Boolean);
      // text is blank
      if (words.length === 0) {
        return null;
      }
      // first word supposed to be an existing site
      // query is all remaining words

      var _words = _toArray(words),
          first = _words[0],
          rest = _words.slice(1);

      var site = LUT[first];
      var query = rest.join(" ");
      // if not, parse again with default site
      if (!site) {
        return this.parse(defaultSiteName + " " + text);
      }
      // empty query means 'visit', otherwise 'search'
      if (!query) {
        return new Command(site, "", site.visit);
      }
      var encodedQuery = encodeURIComponent(query).replace(/%20/g, "+");
      return new Command(site, query, site.search.replace(/%s/g, encodedQuery));
    }
  };
};
},{}],14:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Completer = function () {
  function Completer(words) {
    _classCallCheck(this, Completer);

    this.words = words;
    this.completions = [];
  }

  _createClass(Completer, [{
    key: "matches",
    value: /*#__PURE__*/regeneratorRuntime.mark(function matches(prefix) {
      var results, i;
      return regeneratorRuntime.wrap(function matches$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              results = Completer.findCompletions(prefix, this.words);

            case 1:
              if (!true) {
                _context.next = 11;
                break;
              }

              i = 0;

            case 3:
              if (!(i < results.length)) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return results[i];

            case 6:
              i += 1;
              _context.next = 3;
              break;

            case 9:
              _context.next = 1;
              break;

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, matches, this);
    })

    //-------------------------------------------------

  }], [{
    key: "findCommonPrefix",
    value: function findCommonPrefix() {
      var words = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var firstWord = words[0];
      if (words.length <= 1) {
        return firstWord || "";
      }
      for (var i = 0; i < firstWord.length; i += 1) {
        for (var j = 1; j < words.length; j += 1) {
          if (!words[j][i] || words[j][i] !== firstWord[i]) {
            return firstWord.slice(0, i);
          }
        }
      }
      // first word matched completely, all words are same
      return firstWord;
    }
  }, {
    key: "findCompletions",
    value: function findCompletions(prefix, words) {
      var matches = words.filter(function (word) {
        return word.startsWith(prefix);
      });
      var commonPrefix = Completer.findCommonPrefix(matches) || prefix;
      return [].concat(_toConsumableArray(new Set([commonPrefix].concat(_toConsumableArray(matches)))));
    }
  }]);

  return Completer;
}();

module.exports = Completer;
},{}],6:[function(require,module,exports) {

},{}],4:[function(require,module,exports) {
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* global window, document, localStorage */

var websites = require("./websites");
var apis = require("./apis");

var sites = [].concat(_toConsumableArray(websites), _toConsumableArray(apis));

var Command = require("./command")(sites, "g");
var Completer = require("./completer");

// import CSS for webpack
require("../less/main.less");

var get = document.getElementById.bind(document);

//-------------------------------------------------
// actions
//-------------------------------------------------

var logUsage = function logUsage(alias) {
  if (!window.localStorage) {
    return;
  }
  if (!localStorage.getItem("logging")) {
    return;
  }
  var usage = JSON.parse(localStorage.getItem("usage")) || {};
  usage[Date.now()] = alias;
  localStorage.setItem("usage", JSON.stringify(usage));
};

var ACTIONS = {
  setCommand: function setCommand(text) {
    if (text === undefined) {
      return;
    }
    get("command_input").value = text;
  },
  getText: function getText() {
    return get("command_input").value.trim();
  },
  submit: function submit() {
    var command = Command.parse(this.getText());
    if (!command) {
      return;
    }
    //console.log("*** window.location =", command.url)
    logUsage(command.site.alias);
    window.location = command.url;
  },
  toggleCheatSheet: function toggleCheatSheet() {
    get("cheatSheetDetails").classList.toggle("hide");
  },
  reduceCheatSheet: function reduceCheatSheet(text) {
    get("cheatSheet").innerHTML = Command.cheatSheet(text).join("\n");
  }
};

//-------------------------------------------------
// deal with q= param
//-------------------------------------------------

{
  var getParams = function getParams(query) {
    var result = {};
    query = query || document.location.search.substring(1);
    query.split("&").forEach(function (param) {
      var parts = param.split("=", 2);
      result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, " ");
    });
    return result;
  };

  ACTIONS.setCommand(getParams().q);
  ACTIONS.submit();
}

//-------------------------------------------------
// event handlers
//-------------------------------------------------

{
  document.body.addEventListener("keydown", function (ev) {
    if (ev.keyCode === 27) {
      // ESC
      ACTIONS.toggleCheatSheet();
    }
    // any key focuses on search field
    if (document.activeElement.tagName.toLowerCase() !== "input") {
      get("command_input").focus();
    }
  });

  //-------------------------------------------------
  // some state
  var completer = new Completer(sites.map(function (site) {
    return site.alias;
  }).sort());
  var commandForm = get("command_form");
  //-------------------------------------------------

  commandForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    ACTIONS.submit();
  });

  var iter = void 0;
  commandForm.addEventListener("keydown", function (ev) {
    if (ev.keyCode === 9) {
      // TAB
      ev.preventDefault();
      if (iter) {
        ACTIONS.setCommand(iter.next().value);
        return;
      }
      var currentText = ACTIONS.getText();
      iter = completer.matches(currentText);
      var replacement = iter.next().value;
      // if the first completion is what we typed, try next one
      if (currentText === replacement) {
        replacement = iter.next().value;
      }
      ACTIONS.setCommand(replacement);
      return;
    }
    // anything else...
    iter = null;
  });

  commandForm.addEventListener("keyup", function () {
    ACTIONS.reduceCheatSheet(ACTIONS.getText().split(/\s+/)[0]);
  });
}
},{"./websites":12,"./apis":8,"./command":10,"./completer":14,"../less/main.less":6}]},{},[4])
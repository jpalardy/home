/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* global window, document */
const sites = __webpack_require__(1);

const Command = __webpack_require__(2)(sites, 'g');

const Completer = __webpack_require__(3); // import CSS for webpack


__webpack_require__(4);

const get = document.getElementById.bind(document); //-------------------------------------------------
// actions
//-------------------------------------------------

const ACTIONS = {
  setCommand(text) {
    if (text === undefined) {
      return;
    }

    get('command_input').value = text;
  },

  getText() {
    return get('command_input').value.trim();
  },

  submit() {
    const command = Command.parse(this.getText());

    if (!command) {
      return;
    } //console.log("*** window.location =", command.url)


    window.location = command.url;
  },

  toggleCheatSheet() {
    get('cheatSheetDetails').classList.toggle('hide');
  },

  reduceCheatSheet(text) {
    get('cheatSheet').innerHTML = Command.cheatSheet(text).join('\n');
  }

}; //-------------------------------------------------
// deal with q= param
//-------------------------------------------------

{
  const getParams = function (query) {
    const result = {};
    query = query || document.location.search.substring(1);
    query.split('&').forEach(param => {
      const parts = param.split('=', 2);
      result[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, ' ');
    });
    return result;
  };

  ACTIONS.setCommand(getParams().q);
  ACTIONS.submit();
} //-------------------------------------------------
// event handlers
//-------------------------------------------------

{
  document.body.addEventListener('keydown', ev => {
    if (ev.keyCode === 27) {
      // ESC
      ACTIONS.toggleCheatSheet();
    } // any key focuses on search field


    if (document.activeElement.tagName.toLowerCase() !== 'input') {
      get('command_input').focus();
    }
  }); //-------------------------------------------------
  // some state

  const completer = new Completer(sites.map(site => site.alias).sort());
  const commandForm = get('command_form'); //-------------------------------------------------

  commandForm.addEventListener('submit', ev => {
    ev.preventDefault();
    ACTIONS.submit();
  });
  let iter;
  commandForm.addEventListener('keydown', ev => {
    if (ev.keyCode === 9) {
      // TAB
      ev.preventDefault();

      if (!iter) {
        iter = completer.matches(ACTIONS.getText());
      }

      ACTIONS.setCommand(iter.next().value);
    }

    if (ev.keyCode !== 9) {
      // TAB
      iter = null;
    }
  });
  commandForm.addEventListener('keyup', () => {
    ACTIONS.reduceCheatSheet(ACTIONS.getText().split(/\s+/)[0]);
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = [{
  alias: 'g',
  name: 'google',
  search: 'https://www.google.com/search?q=%s'
}, {
  alias: 'gt',
  name: 'google translate',
  search: 'https://translate.google.com/#auto|en|%s'
}, {
  alias: 'gim',
  name: 'google image',
  search: 'https://www.google.com/search?q=%s&tbm=isch',
  visit: 'https://www.google.com/imghp?tbm=isch'
}, {
  alias: 'gmap',
  name: 'google maps',
  search: 'https://maps.google.com/maps?oi=map&q=%s'
}, {
  alias: 'w3w',
  name: 'what3words',
  search: 'https://map.what3words.com/%s'
}, {
  alias: 'gfin',
  name: 'google finance',
  search: 'https://www.google.com/finance?q=%s',
  visit: 'https://www.google.com/finance'
}, {
  alias: 'tw',
  name: 'twitter',
  search: 'https://twitter.com/search?q=%s'
}, {
  alias: 'yt',
  name: 'youtube',
  search: 'https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search'
}, {
  alias: 'b',
  name: 'bing',
  search: 'http://www.bing.com/search?q=%s'
}, {
  alias: 'sh',
  name: 'symbol hound',
  search: 'http://symbolhound.com/?q=%s'
}, {
  alias: 'wa',
  name: 'wolfram alpha',
  search: 'https://www.wolframalpha.com/input/?i=%s'
}, {
  alias: 'ddg',
  name: 'duckduckgo',
  search: 'https://duckduckgo.com/?q=%s'
}, {
  alias: 'wp',
  name: 'wikipedia',
  search: 'https://en.wikipedia.org/?search=%s'
}, {
  alias: 'mw',
  name: 'merriam-webster',
  search: 'https://www.merriam-webster.com/dictionary/%s'
}, {
  alias: 'ud',
  name: 'urban dictionary',
  search: 'http://www.urbandictionary.com/define.php?term=%s'
}, {
  name: 'emoji',
  search: 'https://emojipedia.org/search/?q=%s'
}, {
  alias: 'so',
  name: 'stack overflow',
  search: 'http://stackoverflow.com/search?q=%s'
}, {
  alias: 'cv',
  name: 'cross validated',
  search: 'http://stats.stackexchange.com/search?q=%s'
}, {
  alias: 'am',
  name: 'amazon.com',
  search: 'http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s'
}, {
  alias: 'am.ca',
  name: 'amazon.ca',
  search: 'http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s'
}, {
  name: 'audible',
  search: 'http://www.audible.com/search?advsearchKeywords=%s'
}, {
  name: 'vpl',
  search: 'http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue',
  visit: 'http://www.vpl.ca/'
}, {
  alias: 'bp',
  name: 'bookpiles',
  search: 'https://bookpiles.ca/jonathan/books?q=%s',
  visit: 'https://bookpiles.ca/jonathan/books'
}, {
  name: 'leanpub',
  search: 'https://leanpub.com/bookstore/type/book/sort/earnings_in_last_7_days?search=%s'
}, {
  name: 'ebooks-it',
  search: 'https://ebooks-it.org/search-engine.htm?bform=btitle&page=1&query=%s',
  hide: true
}, {
  name: 'libgen',
  search: 'http://libgen.io/search.php?req=%s',
  hide: true
}, {
  name: 'imdb',
  search: 'http://imdb.com/find?q=%s'
}, {
  name: 'yelp',
  search: 'http://www.yelp.com/search?find_desc=%s'
}, {
  alias: 'rt',
  name: 'rotten tomatoes',
  search: 'http://www.rottentomatoes.com/search/?search=%s'
}, {
  alias: 'gh',
  name: 'github',
  search: 'https://github.com/search?q=%s',
  visit: 'https://github.com/jpalardy'
}, {
  alias: 'dh',
  name: 'docker hub',
  search: 'https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=%s&starCount=0'
}, {
  alias: 'ls',
  name: 'yubnub',
  search: 'http://yubnub.org/kernel/ls?args=%s'
}, {
  alias: 'ch',
  name: 'color-hex',
  search: 'http://www.color-hex.com/color/%s'
}, {
  name: 'caniuse',
  search: 'http://caniuse.com/#search=%s'
}, {
  alias: 'ann',
  name: 'anime news network',
  search: 'http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s',
  hide: true
}, {
  name: 'anidb',
  search: 'http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist',
  hide: true
}, {
  alias: 'cr',
  name: 'crunchyroll',
  search: 'http://www.crunchyroll.com/search?q=%s',
  hide: true
}, {
  alias: 'fun',
  name: 'funimation',
  search: 'http://www.funimation.com/search?q=%s',
  hide: true
}, {
  alias: 'nf',
  name: 'netflix',
  search: 'http://www.netflix.com/search/%s',
  hide: true
}, {
  name: 'heisig',
  search: 'http://home.jpalardy.com/heisig/#%s',
  visit: 'http://home.jpalardy.com/heisig/',
  hide: true
}, {
  alias: 'rd',
  name: 'romajidesu',
  search: 'http://www.romajidesu.com/dictionary/meaning-of-%s.html',
  hide: true
}, {
  alias: 'wr',
  name: 'wordreference',
  search: 'http://www.wordreference.com/es/en/translation.asp?spen=%s',
  hide: true
}, {
  alias: 'cnm',
  name: 'cinema, vancouver',
  visit: 'http://www.cinemaclock.com/bri/vancouver',
  hide: true
}, {
  alias: 'fs',
  name: 'fatsecret',
  search: 'http://www.fatsecret.com/calories-nutrition/search?q=%s',
  visit: 'http://www.fatsecret.com/calories-nutrition/',
  hide: true
}, {
  alias: 'api.nodejs',
  name: 'nodejs api',
  visit: 'https://nodejs.org/api/',
  hide: true
}, {
  alias: 'api.express',
  name: 'express api',
  visit: 'https://expressjs.com/en/4x/api.html',
  hide: true
}, {
  alias: 'api.jq',
  name: 'jq api',
  visit: 'https://stedolan.github.io/jq/manual/',
  hide: true
}, {
  alias: 'api.aws',
  name: 'aws api',
  visit: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/',
  hide: true
}, {
  alias: 'api.mdn',
  name: 'mdn api',
  search: 'https://developer.mozilla.org/en-US/search?q=%s',
  visit: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
  hide: true
}, {
  name: 'meetup',
  search: 'https://www.google.com/search?q=meetup+vancouver+%s',
  visit: 'https://www.meetup.com'
}, {
  name: 'udemy',
  search: 'https://www.udemy.com/courses/search/?q=%s',
  hide: true
}].map(site => ({
  name: site.name,
  alias: site.alias || site.name,
  visit: site.visit || site.search.match('^https?://[^/]+/')[0],
  search: site.search || site.visit,
  hide: Boolean(site.hide)
}));

/***/ }),
/* 2 */
/***/ (function(module, exports) {

class Command {
  constructor(site, query, url) {
    this.site = site;
    this.query = query;
    this.url = url;
  }

  toString() {
    return `${this.site.alias} ${this.query}`;
  }

} //-------------------------------------------------


module.exports = function (sites, defaultSiteName) {
  const cheatSheet = sites.filter(site => !site.hide).map(site => `${site.alias}\t${site.name}`);
  const LUT = sites.reduce((acc, site) => {
    acc[site.alias] = site;
    return acc;
  }, {});
  return {
    cheatSheet(text) {
      const lines = cheatSheet.filter(line => line.indexOf(text) === 0); // match:   filtered down list
      // nomatch: _everything_

      return lines.length ? lines : cheatSheet;
    },

    parse(text) {
      const words = text.trim().split(/ +/).filter(Boolean); // text is blank

      if (words.length === 0) {
        return null;
      } // first word supposed to be an existing site
      // query is all remaining words


      const [first, ...rest] = words;
      const site = LUT[first];
      const query = rest.join(' '); // if not, parse again with default site

      if (!site) {
        return this.parse(`${defaultSiteName} ${text}`);
      } // empty query means 'visit', otherwise 'search'


      if (!query) {
        return new Command(site, '', site.visit);
      }

      const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
      return new Command(site, query, site.search.replace(/%s/g, encodedQuery));
    }

  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Completer {
  constructor(words) {
    this.words = words;
    this.completions = [];
  }

  *matches(prefix) {
    const results = Completer.findCompletions(prefix, this.words);

    while (true) {
      for (let i = 0; i < results.length; i += 1) {
        yield results[i];
      }
    }
  } //-------------------------------------------------


  static findCommonPrefix(words = []) {
    const firstWord = words[0];

    if (words.length <= 1) {
      return firstWord || '';
    }

    for (let i = 0; i < firstWord.length; i += 1) {
      for (let j = 1; j < words.length; j += 1) {
        if (!words[j][i] || words[j][i] !== firstWord[i]) {
          return firstWord.slice(0, i);
        }
      }
    } // first word matched completely, all words are same


    return firstWord;
  }

  static findCompletions(prefix, words) {
    const matches = words.filter(word => word.startsWith(prefix));
    const commonPrefix = Completer.findCommonPrefix(matches) || prefix;
    return [...new Set([commonPrefix, ...matches])];
  }

}

module.exports = Completer;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
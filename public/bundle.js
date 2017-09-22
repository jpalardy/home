!function(e){function t(n){if(a[n])return a[n].exports;var s=a[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var a={};t.m=e,t.c=a,t.d=function(e,a,n){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,a){"use strict";var n=a(1),s=a(2)(n,"g"),i=a(3);a(4);var r=document.getElementById.bind(document),o={setCommand:function(e){void 0!==e&&(r("command_input").value=e)},getText:function(){return r("command_input").value.trim()},submit:function(){var e=s.parse(this.getText());e&&(window.location=e.url)},toggleCheatSheet:function(){r("cheatSheetDetails").classList.toggle("hide")},reduceCheatSheet:function(e){r("cheatSheet").innerHTML=s.cheatSheet(e).join("\n")}};o.setCommand(function(e){var t={};return e=e||document.location.search.substring(1),e.split("&").forEach(function(e){var a=e.split("=",2);t[a[0]]=decodeURIComponent(a[1]).replace(/\+/g," ")}),t}().q),o.submit(),document.body.addEventListener("keydown",function(e){27===e.keyCode&&o.toggleCheatSheet(),"input"!==document.activeElement.tagName.toLowerCase()&&r("command_input").focus()});var c=new i(n.map(function(e){return e.alias})),h=r("command_form");h.addEventListener("submit",function(e){e.preventDefault(),o.submit()}),h.addEventListener("keydown",function(e){9===e.keyCode&&(e.preventDefault(),o.setCommand(c.next(o.getText()))),9!==e.keyCode&&c.reset()}),h.addEventListener("keyup",function(){o.reduceCheatSheet(o.getText().split(/\s+/)[0])})},function(e,t,a){"use strict";e.exports=[{alias:"g",name:"google",search:"https://www.google.com/search?q=%s"},{alias:"gt",name:"google translate",search:"https://translate.google.com/#auto|en|%s"},{alias:"gim",name:"google image",search:"https://www.google.com/search?q=%s&tbm=isch",visit:"https://www.google.com/imghp?tbm=isch"},{alias:"gmap",name:"google maps",search:"https://maps.google.com/maps?oi=map&q=%s"},{alias:"w3w",name:"what3words",search:"https://map.what3words.com/%s"},{alias:"gfin",name:"google finance",search:"https://www.google.com/finance?q=%s",visit:"https://www.google.com/finance"},{alias:"tw",name:"twitter",search:"https://twitter.com/search?q=%s"},{alias:"yt",name:"youtube",search:"https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search"},{alias:"b",name:"bing",search:"http://www.bing.com/search?q=%s"},{alias:"sh",name:"symbol hound",search:"http://symbolhound.com/?q=%s"},{alias:"wa",name:"wolfram alpha",search:"https://www.wolframalpha.com/input/?i=%s"},{alias:"ddg",name:"duckduckgo",search:"https://duckduckgo.com/?q=%s"},{alias:"wp",name:"wikipedia",search:"https://en.wikipedia.org/?search=%s"},{alias:"mw",name:"merriam-webster",search:"https://www.merriam-webster.com/dictionary/%s"},{alias:"ud",name:"urban dictionary",search:"http://www.urbandictionary.com/define.php?term=%s"},{name:"emoji",search:"https://emojipedia.org/search/?q=%s"},{alias:"so",name:"stack overflow",search:"http://stackoverflow.com/search?q=%s"},{alias:"cv",name:"cross validated",search:"http://stats.stackexchange.com/search?q=%s"},{alias:"am",name:"amazon.com",search:"http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s"},{alias:"am.ca",name:"amazon.ca",search:"http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s"},{name:"audible",search:"http://www.audible.com/search?advsearchKeywords=%s"},{name:"vpl",search:"http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue",visit:"http://www.vpl.ca/"},{alias:"bp",name:"bookpiles",search:"https://bookpiles.ca/jonathan/books?q=%s",visit:"https://bookpiles.ca/jonathan/books"},{name:"leanpub",search:"https://leanpub.com/bookstore/type/book/sort/earnings_in_last_7_days?search=%s"},{name:"ebooks-it",search:"https://ebooks-it.org/search-engine.htm?bform=btitle&page=1&query=%s",hide:!0},{name:"libgen",search:"http://libgen.io/search.php?req=%s",hide:!0},{name:"imdb",search:"http://imdb.com/find?q=%s"},{name:"yelp",search:"http://www.yelp.com/search?find_desc=%s"},{alias:"rt",name:"rotten tomatoes",search:"http://www.rottentomatoes.com/search/?search=%s"},{alias:"gh",name:"github",search:"https://github.com/search?q=%s",visit:"https://github.com/jpalardy"},{alias:"dh",name:"docker hub",search:"https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=%s&starCount=0"},{alias:"ls",name:"yubnub",search:"http://yubnub.org/kernel/ls?args=%s"},{alias:"ch",name:"color-hex",search:"http://www.color-hex.com/color/%s"},{name:"caniuse",search:"http://caniuse.com/#search=%s"},{alias:"ann",name:"anime news network",search:"http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s",hide:!0},{name:"anidb",search:"http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist",hide:!0},{alias:"cr",name:"crunchyroll",search:"http://www.crunchyroll.com/search?q=%s",hide:!0},{alias:"fun",name:"funimation",search:"http://www.funimation.com/search?q=%s",hide:!0},{alias:"nf",name:"netflix",search:"http://www.netflix.com/search/%s",hide:!0},{name:"heisig",search:"http://home.jpalardy.com/heisig/#%s",visit:"http://home.jpalardy.com/heisig/",hide:!0},{alias:"rd",name:"romajidesu",search:"http://www.romajidesu.com/dictionary/meaning-of-%s.html",hide:!0},{alias:"wr",name:"wordreference",search:"http://www.wordreference.com/es/en/translation.asp?spen=%s",hide:!0},{alias:"cnm",name:"cinema, vancouver",visit:"http://www.cinemaclock.com/bri/vancouver",hide:!0},{alias:"fs",name:"fatsecret",search:"http://www.fatsecret.com/calories-nutrition/search?q=%s",visit:"http://www.fatsecret.com/calories-nutrition/",hide:!0},{alias:"api.nodejs",name:"nodejs api",visit:"https://nodejs.org/api/",hide:!0},{alias:"api.express",name:"express api",visit:"https://expressjs.com/en/4x/api.html",hide:!0},{alias:"api.jq",name:"jq api",visit:"https://stedolan.github.io/jq/manual/",hide:!0}].map(function(e){return{name:e.name,alias:e.alias||e.name,visit:e.visit||e.search.match("^https?://[^/]+/")[0],search:e.search||e.visit,hide:Boolean(e.hide)}})},function(e,t,a){"use strict";function n(e){return Array.isArray(e)?e:Array.from(e)}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),r=function(){function e(t,a,n){s(this,e),this.site=t,this.query=a,this.url=n}return i(e,[{key:"toString",value:function(){return this.site.alias+" "+this.query}}]),e}();e.exports=function(e,t){var a=e.filter(function(e){return!e.hide}).map(function(e){return e.alias+"\t"+e.name}),s=e.reduce(function(e,t){return e[t.alias]=t,e},{});return{cheatSheet:function(e){var t=a.filter(function(t){return 0===t.indexOf(e)});return t.length?t:a},parse:function(e){var a=e.trim().split(/ +/).filter(Boolean);if(0===a.length)return null;var i=n(a),o=i[0],c=i.slice(1),h=s[o],m=c.join(" ");if(!h)return this.parse(t+" "+e);if(!m)return new r(h,"",h.visit);var l=encodeURIComponent(m).replace(/%20/g,"+");return new r(h,m,h.search.replace(/%s/g,l))}}}},function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var s=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=function(){function e(t){n(this,e),this.words=t,this.completions=[]}return s(e,[{key:"next",value:function(e){if(this.completions.length>0){var t=this.completions.indexOf(e),a=this.completions.length;return this.completions[(t+1)%a]}return this.completions=this.words.filter(function(t){return 0===t.indexOf(e)&&t!==e}),0===this.completions.length?e:(this.completions.push(e),this.completions[0])}},{key:"reset",value:function(){this.completions=[]}}]),e}();e.exports=i},function(e,t){}]);
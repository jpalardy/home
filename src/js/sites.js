module.exports = [
  {
    alias: 'g',
    name: 'google',
    search: 'https://www.google.com/search?q=%s',
  },
  {
    alias: 'gt',
    name: 'google translate',
    search: 'https://translate.google.com/#auto|en|%s',
  },
  {
    alias: 'gim',
    name: 'google image',
    search: 'https://www.google.com/search?q=%s&tbm=isch',
    visit: 'https://www.google.com/imghp?tbm=isch',
  },
  {
    alias: 'gmap',
    name: 'google maps',
    search: 'https://maps.google.com/maps?oi=map&q=%s',
  },
  {
    alias: 'w3w',
    name: 'what3words',
    search: 'https://map.what3words.com/%s',
  },
  {
    alias: 'gfin',
    name: 'google finance',
    search: 'https://www.google.com/finance?q=%s',
    visit: 'https://www.google.com/finance',
  },
  {
    alias: 'tw',
    name: 'twitter',
    search: 'https://twitter.com/search?q=%s',
  },
  {
    alias: 'yt',
    name: 'youtube',
    search: 'https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search',
  },
  {
    alias: 'b',
    name: 'bing',
    search: 'http://www.bing.com/search?q=%s',
  },
  {
    alias: 'sh',
    name: 'symbol hound',
    search: 'http://symbolhound.com/?q=%s',
  },
  {
    alias: 'wa',
    name: 'wolfram alpha',
    search: 'https://www.wolframalpha.com/input/?i=%s',
  },
  {
    alias: 'ddg',
    name: 'duckduckgo',
    search: 'https://duckduckgo.com/?q=%s',
  },
  {
    alias: 'wp',
    name: 'wikipedia',
    search: 'https://en.wikipedia.org/?search=%s',
  },
  {
    alias: 'mw',
    name: 'merriam-webster',
    search: 'https://www.merriam-webster.com/dictionary/%s',
  },
  {
    alias: 'ud',
    name: 'urban dictionary',
    search: 'http://www.urbandictionary.com/define.php?term=%s',
  },
  {
    name: 'emoji',
    search: 'https://emojipedia.org/search/?q=%s',
  },
  {
    alias: 'so',
    name: 'stack overflow',
    search: 'http://stackoverflow.com/search?q=%s',
  },
  {
    alias: 'cv',
    name: 'cross validated',
    search: 'http://stats.stackexchange.com/search?q=%s',
  },
  {
    alias: 'am',
    name: 'amazon.com',
    search: 'http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s',
  },
  {
    alias: 'am.ca',
    name: 'amazon.ca',
    search: 'http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s',
  },
  {
    name: 'audible',
    search: 'http://www.audible.com/search?advsearchKeywords=%s',
  },
  {
    name: 'vpl',
    search: 'http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue',
    visit: 'http://www.vpl.ca/',
  },
  {
    alias: 'bp',
    name: 'bookpiles',
    search: 'https://bookpiles.ca/jonathan/books?q=%s',
    visit: 'https://bookpiles.ca/jonathan/books',
  },
  {
    name: 'leanpub',
    search: 'https://leanpub.com/bookstore/type/book/sort/earnings_in_last_7_days?search=%s',
  },
  {
    name: 'ebooks-it',
    search: 'https://ebooks-it.org/search-engine.htm?bform=btitle&page=1&query=%s',
    hide: true,
  },
  {
    name: 'libgen',
    search: 'http://libgen.io/search.php?req=%s',
    hide: true,
  },
  {
    name: 'imdb',
    search: 'http://imdb.com/find?q=%s',
  },
  {
    name: 'yelp',
    search: 'http://www.yelp.com/search?find_desc=%s',
  },
  {
    alias: 'rt',
    name: 'rotten tomatoes',
    search: 'http://www.rottentomatoes.com/search/?search=%s',
  },
  {
    alias: 'gh',
    name: 'github',
    search: 'https://github.com/search?q=%s',
    visit: 'https://github.com/jpalardy',
  },
  {
    alias: 'dh',
    name: 'docker hub',
    search: 'https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=%s&starCount=0',
  },
  {
    alias: 'ls',
    name: 'yubnub',
    search: 'http://yubnub.org/kernel/ls?args=%s',
  },
  {
    alias: 'ch',
    name: 'color-hex',
    search: 'http://www.color-hex.com/color/%s',
  },
  {
    name: 'caniuse',
    search: 'http://caniuse.com/#search=%s',
  },
  {
    alias: 'ann',
    name: 'anime news network',
    search: 'http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s',
    hide: true,
  },
  {
    name: 'anidb',
    search: 'http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist',
    hide: true,
  },
  {
    alias: 'cr',
    name: 'crunchyroll',
    search: 'http://www.crunchyroll.com/search?q=%s',
    hide: true,
  },
  {
    alias: 'fun',
    name: 'funimation',
    search: 'http://www.funimation.com/search?q=%s',
    hide: true,
  },
  {
    alias: 'nf',
    name: 'netflix',
    search: 'http://www.netflix.com/search/%s',
    hide: true,
  },
  {
    name: 'heisig',
    search: 'http://home.jpalardy.com/heisig/#%s',
    visit: 'http://home.jpalardy.com/heisig/',
    hide: true,
  },
  {
    alias: 'rd',
    name: 'romajidesu',
    search: 'http://www.romajidesu.com/dictionary/meaning-of-%s.html',
    hide: true,
  },
  {
    alias: 'wr',
    name: 'wordreference',
    search: 'http://www.wordreference.com/es/en/translation.asp?spen=%s',
    hide: true,
  },
  {
    alias: 'cnm',
    name: 'cinema, vancouver',
    visit: 'http://www.cinemaclock.com/bri/vancouver',
    hide: true,
  },
  {
    alias: 'fs',
    name: 'fatsecret',
    search: 'http://www.fatsecret.com/calories-nutrition/search?q=%s',
    visit: 'http://www.fatsecret.com/calories-nutrition/',
    hide: true,
  },
  {
    alias: 'api.nodejs',
    name: 'nodejs api',
    visit: 'https://nodejs.org/api/',
    hide: true,
  },
  {
    alias: 'api.express',
    name: 'express api',
    visit: 'https://expressjs.com/en/4x/api.html',
    hide: true,
  },
  {
    alias: 'api.jq',
    name: 'jq api',
    visit: 'https://stedolan.github.io/jq/manual/',
    hide: true,
  },
  {
    name: 'meetup',
    search: 'https://www.google.com/search?q=meetup+vancouver+%s',
    visit: 'https://www.meetup.com',
  },
].map(site => (
  {
    name:   site.name,
    alias:  site.alias  || site.name,
    visit:  site.visit  || site.search.match('^https?://[^/]+/')[0],
    search: site.search || site.visit,
    hide:   Boolean(site.hide),
  }
));

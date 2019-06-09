module.exports = [
  {
    alias: "g",
    search: "https://www.google.com/search?q=%s",
  },
  {
    alias: "gt",
    search: "https://translate.google.com/#auto|en|%s",
  },
  {
    alias: "gim",
    search: "https://www.google.com/search?q=%s&tbm=isch",
    visit: "https://www.google.com/imghp?tbm=isch",
  },
  {
    alias: "gmap",
    search: "https://maps.google.com/maps?oi=map&q=%s",
  },
  {
    alias: "w3w",
    search: "https://map.what3words.com/%s",
  },
  {
    alias: "gfin",
    search: "https://www.google.com/finance?q=%s",
    visit: "https://www.google.com/finance",
  },
  {
    alias: "tw",
    search: "https://twitter.com/search?q=%s",
  },
  {
    alias: "yt",
    search: "https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search",
  },
  {
    alias: "b",
    search: "https://www.bing.com/search?q=%s",
  },
  {
    alias: "sh",
    search: "http://symbolhound.com/?q=%s",
  },
  {
    alias: "wa",
    search: "https://www.wolframalpha.com/input/?i=%s",
  },
  {
    alias: "ddg",
    search: "https://duckduckgo.com/?q=%s",
  },
  {
    alias: "wp",
    search: "https://en.wikipedia.org/?search=%s",
  },
  {
    alias: "mw",
    search: "https://www.merriam-webster.com/dictionary/%s",
  },
  {
    alias: "ud",
    search: "https://www.urbandictionary.com/define.php?term=%s",
  },
  {
    alias: "emoji",
    search: "https://emojipedia.org/search/?q=%s",
  },
  {
    alias: "so",
    search: "https://stackoverflow.com/search?q=%s",
  },
  {
    alias: "cv",
    search: "https://stats.stackexchange.com/search?q=%s",
  },
  {
    alias: "am",
    search: "https://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s",
  },
  {
    alias: "am.ca",
    search: "https://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s",
  },
  {
    alias: "audible",
    search: "https://www.audible.com/search?advsearchKeywords=%s",
  },
  {
    alias: "vpl",
    search: "https://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue",
    visit: "https://www.vpl.ca/",
  },
  {
    alias: "bp",
    search: "https://bookpiles.ca/jonathan/books?q=%s",
    visit: "https://bookpiles.ca/jonathan/books",
  },
  {
    alias: "leanpub",
    search: "https://leanpub.com/bookstore/type/book/sort/earnings_in_last_7_days?search=%s",
  },
  {
    alias: "ebooks-it",
    search: "https://ebooks-it.org/search-engine.htm?bform=btitle&page=1&query=%s",
  },
  {
    alias: "libgen",
    search: "http://libgen.io/search.php?req=%s",
  },
  {
    alias: "imdb",
    search: "https://imdb.com/find?q=%s",
  },
  {
    alias: "yelp",
    search: "https://www.yelp.com/search?find_desc=%s",
  },
  {
    alias: "rt",
    search: "https://www.rottentomatoes.com/search/?search=%s",
  },
  {
    alias: "gh",
    search: "https://github.com/search?q=%s",
    visit: "https://github.com/jpalardy",
  },
  {
    alias: "ghn",
    visit: "https://github.com/notifications",
  },
  {
    alias: "ght",
    visit: "https://github.com/trending/",
    search: "https://github.com/trending/%s",
  },
  {
    alias: "ghpr",
    visit: "https://github.com/pulls",
    search: "https://github.com/pulls?utf8=✓&q=is%3Aopen+is%3Apr+author%3Ajpalardy+archived%3Afalse+%s",
  },
  {
    alias: "dh",
    search: "https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=%s&starCount=0",
  },
  {
    alias: "ls",
    search: "https://yubnub.org/kernel/ls?args=%s",
  },
  {
    alias: "color-hex",
    search: "https://www.color-hex.com/color/%s",
  },
  {
    alias: "caniuse",
    search: "https://caniuse.com/#search=%s",
  },
  {
    alias: "ann",
    search: "https://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s",
  },
  {
    alias: "anidb",
    search: "https://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist",
  },
  {
    alias: "cr",
    search: "https://www.crunchyroll.com/search?q=%s",
  },
  {
    alias: "fun",
    search: "https://www.funimation.com/search?q=%s",
  },
  {
    alias: "nf",
    search: "https://www.netflix.com/search/%s",
  },
  {
    alias: "heisig",
    search: "https://home.jpalardy.com/heisig/#%s",
    visit: "https://home.jpalardy.com/heisig/",
  },
  {
    alias: "rd",
    search: "http://www.romajidesu.com/dictionary/meaning-of-%s.html",
  },
  {
    alias: "wr",
    search: "https://www.wordreference.com/es/en/translation.asp?spen=%s",
  },
  {
    alias: "cnm",
    visit: "https://www.cinemaclock.com/bri/vancouver",
  },
  {
    alias: "fs",
    search: "https://www.fatsecret.com/calories-nutrition/search?q=%s",
    visit: "https://www.fatsecret.com/calories-nutrition/",
  },
  {
    alias: "meetup",
    search: "https://www.google.com/search?q=meetup+vancouver+%s",
    visit: "https://www.meetup.com",
  },
  {
    alias: "udemy",
    search: "https://www.udemy.com/courses/search/?q=%s",
  },
  {
    alias: "npm",
    search: "https://www.npmjs.org/search?q=%s",
  },
  {
    alias: "yarn",
    search: "https://yarnpkg.com/en/packages?q=%s",
  },
  {
    alias: "linkedin",
    search: "https://www.linkedin.com/search/results/index/?keywords=%s",
  },
  {
    alias: "edx",
    search: "https://www.edx.org/course?search_query=%s",
  },
  {
    alias: "coursera",
    search: "https://www.coursera.org/courses?languages=en&query=%s",
  },
  {
    alias: "jw",
    visit: "https://www.justwatch.com/ca",
    search: "https://www.justwatch.com/ca/search?q=%s",
  },
  {
    alias: "ports",
    visit: "https://www.speedguide.net/ports.php",
    search: "https://www.speedguide.net/ports.php?filter=%s",
  },
  {
    alias: "wtb",
    visit: "https://www.worldtimebuddy.com/",
  },
  {
    alias: "aws",
    search: "https://console.aws.amazon.com/%s/home",
  },
  {
    alias: "devhints",
    search: "https://devhints.io/?q=%s",
  },
  {
    alias: "ct",
    search: "https://www.canadiantire.ca/en/search-results.html?q=%s",
  },
  {
    alias: "bb",
    search: "https://www.bestbuy.ca/en-CA/Search/SearchResults.aspx?query=%s",
  },
  {
    alias: "hd",
    search: "https://www.homedepot.ca/en/home/search.html?q=%s",
  },
].map(site => {
  return {
    alias: site.alias,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
  };
});

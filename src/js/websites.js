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
    search: "http://www.bing.com/search?q=%s",
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
    search: "http://www.urbandictionary.com/define.php?term=%s",
  },
  {
    alias: "emoji",
    search: "https://emojipedia.org/search/?q=%s",
  },
  {
    alias: "so",
    search: "http://stackoverflow.com/search?q=%s",
  },
  {
    alias: "cv",
    search: "http://stats.stackexchange.com/search?q=%s",
  },
  {
    alias: "am",
    search: "http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s",
  },
  {
    alias: "am.ca",
    search: "http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s",
  },
  {
    alias: "audible",
    search: "http://www.audible.com/search?advsearchKeywords=%s",
  },
  {
    alias: "vpl",
    search: "http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue",
    visit: "http://www.vpl.ca/",
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
    search: "http://imdb.com/find?q=%s",
  },
  {
    alias: "yelp",
    search: "http://www.yelp.com/search?find_desc=%s",
  },
  {
    alias: "rt",
    search: "http://www.rottentomatoes.com/search/?search=%s",
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
    search: "http://yubnub.org/kernel/ls?args=%s",
  },
  {
    alias: "color-hex",
    search: "http://www.color-hex.com/color/%s",
  },
  {
    alias: "caniuse",
    search: "http://caniuse.com/#search=%s",
  },
  {
    alias: "ann",
    search: "http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s",
  },
  {
    alias: "anidb",
    search: "http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist",
  },
  {
    alias: "cr",
    search: "http://www.crunchyroll.com/search?q=%s",
  },
  {
    alias: "fun",
    search: "http://www.funimation.com/search?q=%s",
  },
  {
    alias: "nf",
    search: "http://www.netflix.com/search/%s",
  },
  {
    alias: "heisig",
    search: "http://home.jpalardy.com/heisig/#%s",
    visit: "http://home.jpalardy.com/heisig/",
  },
  {
    alias: "rd",
    search: "http://www.romajidesu.com/dictionary/meaning-of-%s.html",
  },
  {
    alias: "wr",
    search: "http://www.wordreference.com/es/en/translation.asp?spen=%s",
  },
  {
    alias: "cnm",
    visit: "http://www.cinemaclock.com/bri/vancouver",
  },
  {
    alias: "fs",
    search: "http://www.fatsecret.com/calories-nutrition/search?q=%s",
    visit: "http://www.fatsecret.com/calories-nutrition/",
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
].map(site => {
  return {
    alias: site.alias,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
  };
});

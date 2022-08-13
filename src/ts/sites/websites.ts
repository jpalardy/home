import {SiteConfig} from "./types";

export const sites: SiteConfig[] = [
  {
    alias: "g",
    search: "https://www.google.com/search?q=%s",
  },
  {
    alias: "gn",
    search: "https://news.google.com/search?q=%s",
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
    alias: "gfin",
    search: "https://www.google.com/finance?q=%s",
    visit: "https://www.google.com/finance",
  },
  {
    alias: "gplay",
    search: "https://play.google.com/store/search?q=%s&c=movies&hl=en",
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
    alias: "yts",
    visit: "https://www.youtube.com/feed/subscriptions",
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
    alias: "am",
    search: "https://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s",
  },
  {
    alias: "amca",
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
    search: "https://leanpub.com/bookstore?type=all&search=%s",
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
    search: "https://github.com/search?q=%s&type=code",
    visit: "https://github.com/jpalardy",
  },
  {
    alias: "ghn",
    visit: "https://github.com/notifications",
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
    alias: "color",
    search: "https://color.adobe.com/search?q=%s",
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
    alias: "nf",
    search: "https://www.netflix.com/search/%s",
  },
  {
    alias: "heisig",
    search: "https://home.jpalardy.com/heisig/?q=%s",
    visit: "https://home.jpalardy.com/heisig/",
  },
  {
    alias: "bookmarklets",
    visit: "https://blog.jpalardy.com/bookmarklets/",
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
    alias: "linkedin",
    search: "https://www.linkedin.com/jobs/search/?keywords=%s",
    visit: "https://www.linkedin.com/jobs/",
  },
  {
    alias: "udemy",
    search: "https://www.udemy.com/courses/search/?q=%s",
  },
  {
    alias: "edx",
    search: "https://www.edx.org/search?q=%s",
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
    alias: "wtb",
    visit: "https://www.worldtimebuddy.com/",
  },
  {
    alias: "aws",
    search: "https://console.aws.amazon.com/%s/home",
  },
  {
    alias: "usgs",
    visit: "https://earthquake.usgs.gov/earthquakes/map/",
  },
  {
    alias: "investopedia",
    search: "https://www.investopedia.com/search?q=%s",
  },
  {
    alias: "yfin",
    search: "https://finance.yahoo.com/q?s=%s",
  },
  {
    alias: "chart",
    search: "https://finance.yahoo.com/chart/%s",
  },
  {
    alias: "newegg",
    search: "https://www.newegg.ca/p/pl?d=%s",
  },
  {
    alias: "dw",
    search: "https://distrowatch.com/table.php?distribution=%s",
  },
  {
    alias: "protondb",
    search: "https://www.protondb.com/search?q=%s",
  },
  {
    alias: "ac",
    visit: "https://www.allareacodes.com/%s",
  },
  {
    alias: "gist",
    visit: "https://gist.github.com/jpalardy",
    search: "https://gist.github.com/search?q=%s",
  },
  {
    alias: "hs",
    visit: "https://www.handspeak.com/word/search/",
  },
  {
    alias: "sign",
    search: "https://home.jpalardy.com/sign/?q=%s",
    visit: "https://home.jpalardy.com/sign/",
  },
  {
    alias: "reebee",
    search: "https://www.reebee.com/flyers?q=%s&sort=price",
    visit: "https://www.reebee.com/flyers",
  },
  {
    alias: "ct",
    search: "https://www.canadiantire.ca/en/search-results.html?q=%s",
  },
  {
    alias: "te",
    search: "https://tradingeconomics.com/search.aspx?q=%s",
    visit: "https://tradingeconomics.com/stream",
  },
];

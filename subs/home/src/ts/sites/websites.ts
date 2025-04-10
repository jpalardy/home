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
    alias: "gd",
    search: "https://drive.google.com/drive/search?q=%s",
  },
  {
    alias: "reddit",
    visit: `https://www.reddit.com/`,
    search: `https://www.google.com/search?q=%s+reddit`,
  },
  {
    alias: "bsky",
    search: "https://bsky.app/search?q=%s",
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
    alias: "w13",
    search: "https://www.websters1913.com/words/%s",
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
    search: "https://www.amazon.com/s?k=%s",
  },
  {
    alias: "amca",
    search: "https://www.amazon.ca/s?k=%s",
  },
  {
    alias: "yelp",
    search: "https://www.yelp.com/search?find_desc=%s",
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
    alias: "heisig",
    search: "https://home.jpalardy.com/heisig/?q=%s",
    visit: "https://home.jpalardy.com/heisig/",
  },
  {
    alias: "sign",
    search: "https://home.jpalardy.com/sign/?q=%s",
    visit: "https://home.jpalardy.com/sign/",
  },
  {
    alias: "aliases",
    visit: "/aliases.txt",
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
    alias: "jisho",
    search: "https://jisho.org/search/%s",
  },
  {
    alias: "wr",
    search: "https://www.wordreference.com/es/en/translation.asp?spen=%s",
  },
  {
    alias: "fs",
    search: "https://www.fatsecret.com/calories-nutrition/search?q=%s",
    visit: "https://www.fatsecret.com/calories-nutrition/",
  },
  {
    alias: "udemy",
    search: "https://www.udemy.com/courses/search/?q=%s",
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
    alias: "ychart",
    search: "https://finance.yahoo.com/chart/%s",
  },
  {
    alias: "dw",
    search: "https://distrowatch.com/table.php?distribution=%s",
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
    alias: "ct",
    search: "https://www.canadiantire.ca/en/search-results.html?q=%s",
  },
  {
    alias: "te",
    search: "https://tradingeconomics.com/search.aspx?q=%s",
    visit: "https://tradingeconomics.com/stream",
  },
  {
    alias: "brew",
    search: "https://formulae.brew.sh/formula/%s#default",
  },
  {
    alias: "mise.plugins",
    visit: "https://github.com/jdx/mise/blob/main/registry.toml",
  },
  {
    alias: "brewer",
    visit: "https://colorbrewer2.org/",
  },
  {
    alias: "ak",
    search: "https://www.animatedknots.com/?s=%s",
  },
  {
    alias: "wk",
    search: "https://www.wanikani.com/search?query=%s",
  },
  {
    alias: ">",
    search: "https://home.jpalardy.com/?q=%s",
  },
];

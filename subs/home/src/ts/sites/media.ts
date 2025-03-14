import {SiteConfig} from "./types";

export const sites: SiteConfig[] = [
  {
    alias: "yt",
    search: "https://www.youtube.com/results?search_query=%s",
  },
  {
    alias: "ytt",
    search: "https://www.youtube.com/results?search_query=trailer+%s",
  },
  {
    alias: "yts",
    visit: "https://www.youtube.com/feed/subscriptions",
  },
  {
    alias: "ytl",
    search: "https://www.youtube.com/watch?v=%s",
    mod: (query: string) => {
      try {
        return new URL(query).pathname.match("^/shorts/(.*)$")?.[1] || query;
      } catch {
        return query;
      }
    },
  },
  {
    alias: "audible",
    search: "https://www.audible.com/search?advsearchKeywords=%s",
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
    search: "https://www.netflix.com/search?q=%s",
  },
  {
    alias: "jw",
    visit: "https://www.justwatch.com/ca",
    search: "https://www.justwatch.com/ca/search?q=%s",
  },
  {
    alias: "protondb",
    search: "https://www.protondb.com/search?q=%s",
  },
  {
    alias: "steam",
    search: "https://store.steampowered.com/search/?term=%s",
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
    alias: "rt",
    search: "https://www.rottentomatoes.com/search/?search=%s",
  },
  {
    alias: "cnm",
    visit: "https://www.cinemaclock.com/bri/vancouver",
  },
  {
    alias: "mc",
    search: "https://www.metacritic.com/search/%s/",
  },
  {
    alias: "courteau",
    visit: "https://ici.radio-canada.ca/ohdio/musique/emissions/6003/tellementcourteau",
  },
  {
    alias: "abe",
    search: "https://www.abebooks.com/servlet/SearchResults?kn=%s&pt=book",
  },
  {
    alias: "gr",
    search: "https://www.goodreads.com/search?utf8=%E2%9C%93&query=%s",
  },
  {
    alias: "atv",
    search: "https://tv.apple.com/search?term=%s",
  },
];

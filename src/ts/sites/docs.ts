type FullSite = {
  alias: string;
  search: string;
  visit: string;
};
type SearchSite = {
  alias: string;
  search: string;
};
type BookmarkSite = {
  alias: string;
  visit: string;
};

type SiteConfig = FullSite | SearchSite | BookmarkSite;

// -------------------------------------------------

const googleSearch = function (alias: string, words: string): FullSite {
  return {
    alias: `g@${alias}`,
    visit: `https://www.google.com/search?q=${words}`,
    search: `https://www.google.com/search?q=${words}+%s`,
  };
};

const sites: SiteConfig[] = [
  // -------------------------------------------------
  // misc
  // -------------------------------------------------
  {
    alias: "apk",
    search: "https://pkgs.alpinelinux.org/contents?file=%s&arch=x86_64",
  },
  {
    alias: "jq",
    visit: "https://stedolan.github.io/jq/manual/",
  },
  {
    alias: "mdn",
    search: "https://developer.mozilla.org/en-US/search?q=%s",
    visit: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
  },
  {
    alias: "pg",
    search: "https://www.postgresql.org/search/?q=%s",
  },
  googleSearch("pg", "postgresql"),
  // -------------------------------------------------
  // css
  // -------------------------------------------------
  {
    alias: "tac",
    visit: "https://tachyons.io/docs/",
  },
  {
    alias: "tac_",
    visit: "https://github.com/tachyons-css/tachyons/blob/main/css/tachyons.css",
  },
  {
    alias: "flex",
    visit: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
  },
  {
    alias: "grid",
    visit: "https://css-tricks.com/snippets/css/complete-guide-grid/",
  },
  {
    alias: "fa",
    search: "https://fontawesome.com/v5.15/icons?d=gallery&p=2&q=%s&m=free",
  },
  // -------------------------------------------------
  // elixir, phoenix
  // -------------------------------------------------
  {
    alias: "hex",
    search: "https://hex.pm/packages?search=%s",
  },
  {
    alias: "exm",
    search: "https://hexdocs.pm/elixir/%s.html#summary",
    visit: "https://hexdocs.pm/elixir/",
  },
  {
    alias: "ef",
    search: "https://elixirforum.com/search?q=%s",
  },
  googleSearch("ex", "elixir"),
  googleSearch("erl", "erlang"),
  googleSearch("phx", "elixir+phoenix"),
  // -------------------------------------------------
  // elm
  // -------------------------------------------------
  {
    alias: "elm",
    search: "https://package.elm-lang.org/packages/elm/%s/latest/",
  },
  {
    alias: "elm-sig",
    search: "https://klaftertief.github.io/elm-search/?q=%s",
    visit: "https://elm-lang.org/docs",
  },
];

export default sites.map((site): FullSite => {
  if (!("search" in site)) {
    return {...site, search: site.visit};
  }
  if (!("visit" in site)) {
    const visit = new URL(site.search).origin;
    return {...site, visit};
  }
  return site;
});
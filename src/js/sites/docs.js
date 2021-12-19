function capitalize(str) {
  return str.toLowerCase().replace(/./, (c) => c.toUpperCase());
}

function googleSearch(alias, words) {
  return {
    alias: `g@${alias}`,
    visit: `https://www.google.com/search?q=${words}`,
    search: `https://www.google.com/search?q=${words}+%s`,
  };
}

module.exports = [
  // -------------------------------------------------
  // misc
  // -------------------------------------------------
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
  {
    alias: "pgf",
    visit: "https://www.postgresql.org/docs/current/functions.html",
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
    alias: "flexboxfroggy",
    visit: "https://flexboxfroggy.com/",
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
    queryMod: capitalize,
  },
  ["Kernel", "String", "Enum", "Keyword", "List", "Map"].map((name) => ({
    alias: `exm@${name.toLowerCase()}`,
    visit: `https://hexdocs.pm/elixir/${name}.html#summary`,
  })),
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
]
  .flat()
  .map((site) => {
    return {
      alias: site.alias,
      visit: site.visit || site.search.match("^https?://[^/]+/")[0],
      search: site.search || site.visit,
      queryMod: site.queryMod,
    };
  });

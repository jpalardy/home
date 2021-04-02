module.exports = [
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
    alias: "golang",
    search: "https://pkg.go.dev/search?q=%s",
  },
  {
    alias: "rust",
    search: "https://doc.rust-lang.org/std/index.html?search=%s",
    visit: "https://doc.rust-lang.org/std/index.html",
  },
  {
    alias: "hex",
    search: "https://hex.pm/packages?search=%s",
  },
  {
    alias: "hd",
    search: "https://hexdocs.pm/%s/",
  },
  {
    alias: "ex",
    search: "https://hexdocs.pm/elixir/search.html?q=%s",
    visit: "https://elixir-lang.org/docs.html",
  },
  {
    alias: "phx",
    search: "https://hexdocs.pm/phoenix/search.html?q=%s",
    visit: "https://www.phoenixframework.org/",
  },
  {
    alias: "ef",
    search: "https://elixirforum.com/search?q=%s",
  },
  {
    alias: "ge",
    search: "https://www.google.com/search?q=elixir+%s",
  },
  {
    alias: "gerl",
    search: "https://www.google.com/search?q=erlang+%s",
  },
  {
    alias: "gep",
    search: "https://www.google.com/search?q=elixir+phoenix+%s",
  },
  {
    alias: "postgres",
    search: "https://www.postgresql.org/search/?q=%s",
  },
  {
    alias: "elm",
    search: "https://klaftertief.github.io/elm-search/?q=%s",
    visit: "https://elm-lang.org/docs",
  },
].map(site => {
  return {
    alias: site.alias,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
  };
});

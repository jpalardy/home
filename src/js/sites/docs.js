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
    alias: "elixir",
    search: "https://hexdocs.pm/elixir/search.html?q=%s",
    visit: "https://elixir-lang.org/docs.html",
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

import {SiteConfig} from "./types";

export const sites: SiteConfig[] = [
  // -------------------------------------------------
  // packages
  // -------------------------------------------------
  {
    alias: "pkg.apk",
    search: "https://pkgs.alpinelinux.org/contents?file=%s&arch=x86_64",
  },
  {
    alias: "pkg.aur",
    search: "https://aur.archlinux.org/packages?K=%s",
  },
  {
    alias: "pkg.arch",
    search: "https://archlinux.org/packages/?q=%s",
  },
  {
    alias: "pkg.manjaro",
    visit: "https://manjaristas.org/branch_compare",
    search: "https://manjaristas.org/branch_compare?q=%s",
  },
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
    alias: "vim.digraphs",
    visit: "https://vimhelp.org/digraph.txt.html",
  },
  // -------------------------------------------------
  // css
  // -------------------------------------------------
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
    search: "https://fontawesome.com/search?q=%s&o=r&m=free",
  },
  // -------------------------------------------------
  // elixir, phoenix
  // -------------------------------------------------
  {
    alias: "hex",
    search: "https://hex.pm/packages?search=%s",
  },
  {
    alias: "hd",
    search: "https://hexdocs.pm/elixir/search.html?q=%s",
    visit: "https://hexdocs.pm/elixir/",
  },
  {
    alias: "ef",
    search: "https://elixirforum.com/search?q=%s",
  },
  {
    alias: "_ex",
    visit: `https://www.google.com/search?q=elixir`,
    search: `https://www.google.com/search?q=elixir+%s`,
  },
  {
    alias: "_erl",
    visit: "https://www.google.com/search?q=erlang",
    search: "https://www.google.com/search?q=erlang+%s",
  },
  {
    alias: "_phx",
    visit: "https://www.google.com/search?q=elixir+phoenix",
    search: "https://www.google.com/search?q=elixir+phoenix+%s",
  },
  {
    alias: "ex.inspect.opts",
    visit: "https://hexdocs.pm/elixir/Inspect.Opts.html",
  },
  {
    alias: "ex.special.forms",
    visit: "https://hexdocs.pm/elixir/Kernel.SpecialForms.html",
  },
  {
    alias: "ex.mix.test",
    visit: "https://hexdocs.pm/mix/Mix.Tasks.Test.html",
  },
  {
    alias: "ex.typespecs",
    visit: "https://hexdocs.pm/elixir/typespecs.html",
  },
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
    visit: "https://klaftertief.github.io/elm-search/",
  },
  // -------------------------------------------------
  // R
  // -------------------------------------------------
  {
    alias: "tidy",
    visit: "https://www.tidyverse.org/packages/",
  },
];

import {SiteConfig, FullSite} from "./types";

function googleSearch(alias: string, words: string): FullSite {
  return {
    alias: `_${alias}`,
    visit: `https://www.google.com/search?q=${words}`,
    search: `https://www.google.com/search?q=${words}+%s`,
  };
}

export const sites: SiteConfig[] = [
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
    alias: "hd",
    search: "https://hexdocs.pm/elixir/search.html?q=%s",
    visit: "https://hexdocs.pm/elixir/",
  },
  {
    alias: "ef",
    search: "https://elixirforum.com/search?q=%s",
  },
  googleSearch("ex", "elixir"),
  googleSearch("erl", "erlang"),
  googleSearch("phx", "elixir+phoenix"),
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
    visit: "https://elm-lang.org/docs",
  },
  // -------------------------------------------------
  // R
  // -------------------------------------------------
  {
    alias: "tidy",
    visit: "https://www.tidyverse.org/",
  },
  {
    alias: "tidy.ggplot2",
    visit: "https://ggplot2.tidyverse.org/",
  },
  {
    alias: "tidy.dplyr",
    visit: "https://dplyr.tidyverse.org/",
  },
  {
    alias: "tidy.stringr",
    visit: "https://stringr.tidyverse.org/",
  },
  {
    alias: "tidy.readr",
    visit: "https://readr.tidyverse.org/",
  },
  {
    alias: "tidy.lubridate",
    visit: "https://lubridate.tidyverse.org/",
  },
];

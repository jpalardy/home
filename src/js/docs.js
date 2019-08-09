module.exports = [
  {
    alias: "nodejs",
    visit: "https://nodejs.org/api/",
  },
  {
    alias: "express",
    visit: "https://expressjs.com/en/4x/api.html",
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
    alias: "lodash",
    visit: "https://lodash.com/docs/",
  },
  {
    alias: "async",
    visit: "https://caolan.github.io/async/",
  },
  {
    alias: "golang",
    search: "https://golang.org/search?q=%s",
    visit: "https://golang.org/doc/",
  },
  {
    alias: "golang:pkg",
    visit: "https://golang.org/pkg/",
  },
].map(site => {
  return {
    alias: `doc.${site.alias}`,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
  };
});

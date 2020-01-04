module.exports = [
  {
    alias: "canadiantire",
    search: "https://www.canadiantire.ca/en/search-results.html?q=%s",
  },
  {
    alias: "bestbuy",
    search: "https://www.bestbuy.ca/en-CA/Search/SearchResults.aspx?query=%s",
  },
  {
    alias: "bestbuy",
    search: "https://www.bestbuy.ca/en-CA/Search/SearchResults.aspx?query=%s",
  },
  {
    alias: "homedepot",
    search: "https://www.homedepot.ca/en/home/search.html?q=%s",
  },
].map(site => {
  return {
    alias: `shopping.${site.alias}`,
    visit: site.visit || site.search.match("^https?://[^/]+/")[0],
    search: site.search || site.visit,
  };
});

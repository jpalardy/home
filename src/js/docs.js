module.exports = [
  {
    name: "nodejs",
    visit: "https://nodejs.org/api/",
  },
  {
    name: "express",
    visit: "https://expressjs.com/en/4x/api.html",
  },
  {
    name: "jq",
    visit: "https://stedolan.github.io/jq/manual/",
  },
  {
    name: "aws",
    visit: "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/",
  },
  {
    name: "mdn",
    search: "https://developer.mozilla.org/en-US/search?q=%s",
    visit: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
  },
  {
    name: "lodash",
    visit: "https://lodash.com/docs/",
  },
  {
    name: "ramda",
    visit: "http://ramdajs.com/docs/",
  },
  {
    name: "async",
    visit: "https://caolan.github.io/async/",
  },
  {
    name: "eslint",
    visit: "https://eslint.org/",
  },
].map(site => ({
  name: `${site.name} api`,
  alias: `doc.${site.name}`,
  visit: site.visit || site.search.match("^https?://[^/]+/")[0],
  search: site.search || site.visit,
  hide: true,
}));

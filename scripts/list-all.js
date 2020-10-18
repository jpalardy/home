const websites = require("../src/js/sites/websites");
const docs = require("../src/js/sites/docs");

/* eslint-disable no-console */
[...websites, ...docs].forEach(site => {
  console.log(site.alias, site.visit);
});

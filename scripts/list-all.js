const websites = require("../src/js/websites");
const docs = require("../src/js/docs");

/* eslint-disable no-console */
[...websites, ...docs].forEach(site => {
  console.log(site.alias, site.visit);
});

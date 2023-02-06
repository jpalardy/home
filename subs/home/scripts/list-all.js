const {sites} = require("../dist/sites");

/* eslint-disable no-console */
sites.forEach(site => {
  console.log(site.alias, site.visit);
});

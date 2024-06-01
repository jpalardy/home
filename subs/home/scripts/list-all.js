const {sites} = require("../dist/sites");

sites.forEach(site => {
  console.log(site.alias, site.visit);
});

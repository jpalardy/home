class Command {
  constructor(site, query, url) {
    this.site = site;
    this.query = query;
    this.url = url;
  }
}

//-------------------------------------------------

module.exports = function create(sites, defaultAlias) {
  const LUT = sites.reduce((acc, site) => {
    acc[site.alias] = site;
    return acc;
  }, {});

  return {
    parse(text) {
      const words = text
        .trim()
        .split(/ +/)
        .filter(Boolean);
      // text is blank
      if (words.length === 0) {
        return null;
      }
      // first word supposed to be an existing site
      // query is all remaining words
      const [first, ...rest] = words;
      const site = LUT[first];
      // if not, parse again with default site
      if (!site) {
        return this.parse(`${defaultAlias} ${text}`);
      }
      let query = rest.join(" ");
      if (site.queryMod) {
        query = site.queryMod(query);
      }
      // empty query means 'visit', otherwise 'search'
      if (!query) {
        return new Command(site, "", site.visit);
      }
      const encodedQuery = encodeURIComponent(query).replace(/%20/g, "+");
      return new Command(site, query, site.search.replace(/%s/g, encodedQuery));
    },
  };
};

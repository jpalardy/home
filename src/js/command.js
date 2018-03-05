class Command {
  constructor(site, query, url) {
    this.site = site;
    this.query = query;
    this.url = url;
  }

  toString() {
    return `${this.site.alias} ${this.query}`;
  }
}

//-------------------------------------------------

module.exports = function(sites, defaultSiteName) {
  const cheatSheet = sites.filter(site => !site.hide).map(site => `${site.alias}\t${site.name}`);
  const LUT = sites.reduce((acc, site) => {
    acc[site.alias] = site;
    return acc;
  }, {});

  return {
    cheatSheet(text) {
      const lines = cheatSheet.filter(line => line.indexOf(text) === 0);
      // match:   filtered down list
      // nomatch: _everything_
      return lines.length ? lines : cheatSheet;
    },
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
      const query = rest.join(" ");
      // if not, parse again with default site
      if (!site) {
        return this.parse(`${defaultSiteName} ${text}`);
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

import {FullSite} from "./sites";

class Command {
  readonly site: FullSite;

  readonly query: string;

  readonly url: string;

  constructor(site: FullSite, query: string, url: string) {
    this.site = site;
    this.query = query;
    this.url = url;
  }
}

const Parser = function create(sites: FullSite[], defaultAlias: string) {
  const LUT = new Map(sites.map((site) => [site.alias, site]));

  return {
    parse(text: string): Command {
      const words = text.trim().split(/ +/).filter(Boolean);
      // text is blank
      if (words.length === 0) {
        return this.parse(defaultAlias);
      }
      // first word supposed to be an existing site
      // query is all remaining words
      const [first, ...rest] = words;
      const site = LUT.get(first);
      // if not, parse again with default site
      if (!site) {
        return this.parse(`${defaultAlias} ${text}`);
      }
      const query = rest.join(" ");
      // empty query means 'visit', otherwise 'search'
      if (!query) {
        return new Command(site, query, site.visit);
      }
      const encodedQuery = encodeURIComponent(query).replace(/%20/g, "+");
      if (site.search.includes("%s")) {
        return new Command(site, query, site.search.replace(/%s/g, encodedQuery));
      }
      // happens for sites without search functionality...
      // at least, query is in the url, as a reminder
      return new Command(site, query, `${site.search}#${encodedQuery}`);
    },
  };
}

export {Command, Parser};

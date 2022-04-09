import {FullSite} from "./sites";

type Command = {
  readonly site: FullSite;
  readonly query: string;
  readonly url: string;
};

export function parser(sites: FullSite[], defaultAlias: string) {
  const LUT = new Map(sites.map((site) => [site.alias, site]));

  return function parse(text: string): Command {
    const [first, ...rest] = text.trim().split(/ +/).filter(Boolean);
    // text is blank
    if (first === undefined) {
      return parse(defaultAlias);
    }
    // first word supposed to be an existing site
    // query is all remaining words
    const site = LUT.get(first);
    // if not, parse again with default site
    if (!site) {
      return parse(`${defaultAlias} ${text}`);
    }
    const query = rest.join(" ");
    // empty query means 'visit', otherwise 'search'
    if (!query) {
      return {site, query, url: site.visit};
    }
    const encodedQuery = encodeURIComponent(query).replace(/%20/g, "+");
    if (site.search.includes("%s")) {
      return {site, query, url: site.search.replace(/%s/g, encodedQuery)};
    }
    // happens for sites without search functionality...
    // at least, query is in the url, as a reminder
    return {site, query, url: `${site.search}#${encodedQuery}`};
  };
}

import {FullSite} from "./sites";

type Command = {
  readonly site: FullSite;
  readonly query: string;
  readonly url: string;
};

export function parser(sites: FullSite[], defaultAlias: string) {
  const LUT = new Map(sites.map((site) => [site.alias, site]));

  const queryEncoder = (query: string) => encodeURIComponent(query).replace(/%20/g, "+");

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
    const mod = site.mod || ((str) => str);
    const query = mod(rest.join(" "));
    // empty query means 'visit', otherwise 'search'
    if (!query) {
      return {site, query, url: site.visit};
    }
    const encoder = site.search.match(/\?.*%s/) ? queryEncoder : encodeURIComponent;
    const encodedQuery = encoder(query);
    if (site.search.includes("%s")) {
      return {site, query, url: site.search.replace(/%s/g, encodedQuery)};
    }
    // happens for sites without search functionality...
    // at least, query is in the url, as a reminder
    return {site, query, url: `${site.search}#${encodedQuery}`};
  };
}

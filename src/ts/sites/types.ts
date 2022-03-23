type FullSite = {
  alias: string;
  search: string;
  visit: string;
};
type SearchSite = {
  alias: string;
  search: string;
};
type BookmarkSite = {
  alias: string;
  visit: string;
};

type SiteConfig = FullSite | SearchSite | BookmarkSite;

export {FullSite, SiteConfig};

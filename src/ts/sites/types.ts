type FullSite = {
  readonly alias: string;
  readonly search: string;
  readonly visit: string;
};
type SearchSite = {
  readonly alias: string;
  readonly search: string;
};
type BookmarkSite = {
  readonly alias: string;
  readonly visit: string;
};

type SiteConfig = FullSite | SearchSite | BookmarkSite;

export {FullSite, SiteConfig};

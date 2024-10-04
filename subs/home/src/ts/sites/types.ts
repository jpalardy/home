type queryModifier = (query: string) => string;

type FullSite = {
  readonly alias: string;
  readonly search: string;
  readonly visit: string;
  readonly mod?: queryModifier;
  readonly encoder?: queryModifier;
};
type SearchSite = {
  readonly alias: string;
  readonly search: string;
  readonly mod?: queryModifier;
  readonly encoder?: queryModifier;
};
type BookmarkSite = {
  readonly alias: string;
  readonly visit: string;
  readonly mod?: queryModifier;
  readonly encoder?: queryModifier;
};

type SiteConfig = FullSite | SearchSite | BookmarkSite;

export {FullSite, SiteConfig};

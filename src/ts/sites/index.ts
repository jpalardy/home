import {FullSite, SiteConfig} from "./types";
import {sites as websites} from "./websites";
import {sites as docs} from "./docs";
import {sites as media} from "./media";

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null;
}

function assertSiteConfig(obj: unknown): obj is SiteConfig {
  return isObject(obj) && "alias" in obj && ("search" in obj || "visit" in obj);
}

function convertToFullSite(site: SiteConfig): FullSite {
  if (!("search" in site)) {
    const search = site.visit;
    return {...site, search};
  }
  if (!("visit" in site)) {
    const visit = new URL(site.search).origin;
    return {...site, visit};
  }
  return site;
}

const sites = [...websites, ...docs, ...media].map(convertToFullSite);

export {sites, assertSiteConfig, convertToFullSite, FullSite};

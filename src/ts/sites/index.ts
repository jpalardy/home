import {FullSite, SiteConfig} from "./types";
import {sites as websites} from "./websites";
import {sites as docs} from "./docs";

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

const sites = [...websites, ...docs].map(convertToFullSite);

export {sites, FullSite};


sites = (require "../tmp/js/sites.js").sites

for site, {name} of sites
  console.log "#{site}\t#{name}"


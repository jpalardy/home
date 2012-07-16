
sites = (require "../tmp/js/sites.js").sites

for command, site of sites
  unless site.hide
    console.log "#{command}\t#{site.name}"


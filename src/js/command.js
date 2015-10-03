
var Command = function (query, sites) {
  this.query = query || '';
  this.sites = sites || [];
  var links = this.links = [];
  sites.forEach(function (site) {
    if (query) {
      links.push({site: site, url: Command.sites[site].search.replace(/%s/g, encodeURIComponent(query).replace(/%20/g, '+'))});
      return;
    }
    links.push({site: site, url: Command.sites[site].visit});
  });
  this.urls = links.map(function (link) { return link.url; });
};

Command.prototype.toString = function () {
  return this.sites.join(',') + ' ' + this.query;
};

Command.parse = function (text) {
  var words = text.split(/ +/).filter(Boolean);
  if (words.length === 0) {
    return null;
  }
  var sites = words[0].split(',').filter(function (site) { return Command.sites[site]; });
  if (sites.length) {
    return new Command(words.slice(1).join(' '), sites);
  }
  return new Command(words.join(' '), Command.default_sites);
};

module.exports = Command;

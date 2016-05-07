
var Command = function (site, query, url) {
  this.site = site;
  this.query = query;
  this.url = url;
};

Command.prototype.toString = function () {
  return [this.site.alias, this.query].join(' ');
};

//-------------------------------------------------

module.exports = function (sites, defaultSiteName) {
  var cheatSheet; // set after augmentation below
  sites = (function () {
    var result = {};
    sites.forEach(function (site) {
      site.visit = site.visit || site.search.match('^https?://[^/]+/')[0];
      site.alias = site.alias || site.name;
      result[site.alias] = site;
    });
    cheatSheet = sites.filter(function (site) {
      return !site.hide;
    }).map(function (site) {
      return site.alias + '\t' + site.name;
    });
    return result;
  }());

  var parse = function (text) {
    var words = text.trim().split(/ +/).filter(Boolean);
    // text is blank
    if (words.length === 0) {
      return null;
    }
    // first word supposed to be an existing site
    // if not, parse again with default site
    var site = sites[words[0]];
    if (!site) {
      return parse(defaultSiteName + ' ' + text);
    }
    // query is all remaining words
    var query = words.slice(1).join(' ');
    // empty query means 'visit'
    // otherwise search
    var url = site.visit;
    if (query) {
      var encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
      url = site.search.replace(/%s/g, encodedQuery);
    }
    return new Command(site, query, url);
  };

  return {
    parse: parse,
    cheatSheet: cheatSheet,
  };
};

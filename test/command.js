/* global describe, it */

var assert = require('assert');

var Command = require('../src/js/command').Command;
var sites   = require('../config/sites.json');

Command.sites = (function () {
  var result = {};
  sites.forEach(function (site) {
    result[site.alias] = site;
  });
  return result;
}());
Command.default_sites = ['ddg'];

var assertSites = function (query, sites) {
  var command = Command.parse(query);
  assert.deepEqual(command && command.urls, sites); // command && to test null
};

describe('Command', function () {
  describe('constructor', function () {
    it('constructs properly', function () {
      var command = new Command('something', ['gim', 'yim']);
      assert.strictEqual(command.query, 'something');
      assert.deepEqual(command.sites, ['gim', 'yim']);
      assert.deepEqual(command.links, [{site: 'gim', url: 'https://www.google.com/search?q=something&tbm=isch'},
                                       {site: 'yim', url: 'http://images.search.yahoo.com/search/images?p=something'}]);
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=something&tbm=isch',
                                      'http://images.search.yahoo.com/search/images?p=something']);
    });
  });

  describe('parse', function () {
    it('punts an empty query', function () {
      assertSites('', null);
    });

    it('punts a blank query', function () {
      assertSites('     ', null);
    });

    it('handles a one-word query', function () {
      assertSites('gim something', ['https://www.google.com/search?q=something&tbm=isch']);
    });

    it('handles a two-word query', function () {
      assertSites('gim some thing', ['https://www.google.com/search?q=some+thing&tbm=isch']);
    });

    it('handles a one-word query (default)', function () {
      assertSites('something', ['https://duckduckgo.com/?q=something']);
    });

    it('handles a two-word query (default)', function () {
      assertSites('some thing', ['https://duckduckgo.com/?q=some+thing']);
    });

    it('handles a site without a query', function () {
      assertSites('g', ['https://www.google.com/']);
    });

    it('handles two sites without a query', function () {
      assertSites('g,yim', ['https://www.google.com/',
                             'http://images.search.yahoo.com/search/images']);
    });

    it('handles two sites', function () {
      assertSites('gim,yim something', ['https://www.google.com/search?q=something&tbm=isch',
                                         'http://images.search.yahoo.com/search/images?p=something']);
    });

    it('ignores unknown sites', function () {
      assertSites('gim,unknown,yim,blah something', ['https://www.google.com/search?q=something&tbm=isch',
                                                      'http://images.search.yahoo.com/search/images?p=something']);
    });

    it('handles worst case with bad spacing', function () {
      assertSites('    gim,unknown,yim,blah some     thing      ', ['https://www.google.com/search?q=some+thing&tbm=isch',
                                                                     'http://images.search.yahoo.com/search/images?p=some+thing']);
    });
  });

  describe('parse (legacy)', function () {
    it('does not handle site as a query', function () {
      assertSites('gim yim', ['https://www.google.com/search?q=yim&tbm=isch']);
    });

    it('does not handle site as a query, with a query', function () {
      assertSites('gim yim something', ['https://www.google.com/search?q=yim+something&tbm=isch']);
    });
  });
});

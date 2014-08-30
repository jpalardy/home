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
      var command = Command.parse('');
      assert.strictEqual(command, null);
    });

    it('punts a blank query', function () {
      var command = Command.parse('     ');
      assert.strictEqual(command, null);
    });

    it('handles a one-word query', function () {
      var command = Command.parse('gim something');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=something&tbm=isch']);
    });

    it('handles a two-word query', function () {
      var command = Command.parse('gim some thing');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=some%20thing&tbm=isch']);
    });

    it('handles a one-word query (default)', function () {
      var command = Command.parse('something');
      assert.deepEqual(command.urls, ['https://duckduckgo.com/?q=something']);
    });

    it('handles a two-word query (default)', function () {
      var command = Command.parse('some thing');
      assert.deepEqual(command.urls, ['https://duckduckgo.com/?q=some%20thing']);
    });

    it('handles a site without a query', function () {
      var command = Command.parse('g');
      assert.deepEqual(command.urls, ['https://www.google.com/']);
    });

    it('handles two sites without a query', function () {
      var command = Command.parse('g,yim');
      assert.deepEqual(command.urls, ['https://www.google.com/', 'http://images.search.yahoo.com/search/images']);
    });

    it('handles two sites', function () {
      var command = Command.parse('gim,yim something');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=something&tbm=isch', 'http://images.search.yahoo.com/search/images?p=something']);
    });

    it('ignores unknown sites', function () {
      var command = Command.parse('gim,unknown,yim,blah something');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=something&tbm=isch', 'http://images.search.yahoo.com/search/images?p=something']);
    });
  });

  describe('parse (legacy)', function () {
    it('does not handle site as a query', function () {
      var command = Command.parse('gim yim');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=yim&tbm=isch']);
    });

    it('does not handle site as a query, with a query', function () {
      var command = Command.parse('gim yim something');
      assert.deepEqual(command.urls, ['https://www.google.com/search?q=yim%20something&tbm=isch']);
    });
  });
});

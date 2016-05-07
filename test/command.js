/* global describe, it */

var assert = require('assert');

var sites   = require('../src/js/sites');
var Command = require('../src/js/command')(sites, 'ddg');

var assertURL = function (text, url) {
  var command = Command.parse(text);
  assert.strictEqual(command && command.url, url); // command && to test null
};

describe('Command', function () {
  describe('parse', function () {
    it('punts an empty query', function () {
      assertURL('', null);
    });

    it('punts a blank query', function () {
      assertURL('     ', null);
    });

    it('handles a one-word query', function () {
      assertURL('gim something', 'https://www.google.com/search?q=something&tbm=isch');
    });

    it('handles a two-word query', function () {
      assertURL('gim some thing', 'https://www.google.com/search?q=some+thing&tbm=isch');
    });

    it('handles a one-word query (default)', function () {
      assertURL('something', 'https://duckduckgo.com/?q=something');
    });

    it('handles a two-word query (default)', function () {
      assertURL('some thing', 'https://duckduckgo.com/?q=some+thing');
    });

    it('handles a site without a query', function () {
      assertURL('g', 'https://www.google.com/');
    });

    it('handles worst case with bad spacing', function () {
      assertURL('    gim some     thing      ', 'https://www.google.com/search?q=some+thing&tbm=isch');
    });
  });

  describe('parse (legacy)', function () {
    it('does not handle site as a query', function () {
      assertURL('gim yim', 'https://www.google.com/search?q=yim&tbm=isch');
    });

    it('does not handle site as a query, with a query', function () {
      assertURL('gim yim something', 'https://www.google.com/search?q=yim+something&tbm=isch');
    });
  });
});

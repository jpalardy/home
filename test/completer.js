/* global describe, it, before */
/* eslint prefer-arrow-callback: 0 */

const assert = require('assert');

const Completer = require('../src/js/completer');

describe('Completer', function () {
  describe('class', function () {
    before(function () {
      // all aliases as of 2018-02-10
      this.words = 'g gt gim gmap w3w gfin tw yt b sh wa ddg wp mw ud emoji so cv am am.ca audible vpl bp leanpub ebooks-it libgen imdb yelp rt gh dh ls ch caniuse ann anidb cr fun nf heisig rd wr cnm fs api.nodejs api.express api.jq api.aws api.mdn meetup udemy'.split(' ');
      this.subject = new Completer(this.words);
    });

    it('contains words as given', function () {
      assert.deepEqual(this.subject.words, this.words);
    });

    it('starts without completions', function () {
      assert.deepEqual(this.subject.completions, []);
    });

    it('cycles through completions', function () {
      {
        const matches = this.subject.matches('c');
        const words = ['c', 'cv', 'ch', 'caniuse', 'cr', 'cnm', 'c', 'cv', 'ch'/* ... */];
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
      {
        const matches = this.subject.matches('am');
        const words = ['am', 'am.ca', 'am', 'am.ca', 'am'];
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
    });
  });

  //-------------------------------------------------

  describe('findCommonPrefix', function () {
    it('returns [] for empty array', function () {
      assert.strictEqual(Completer.findCommonPrefix([]), '');
      assert.strictEqual(Completer.findCommonPrefix(),   '');
    });

    it('returns first if array only contains one value', function () {
      assert.strictEqual(Completer.findCommonPrefix(['xxx']), 'xxx');
    });

    it('returns common prefix if found', function () {
      assert.strictEqual(Completer.findCommonPrefix(['amazon', 'ambulance', 'amish']), 'am');
    });

    it('returns common prefix if found, all same', function () {
      assert.strictEqual(Completer.findCommonPrefix(['amazon', 'amazon', 'amazon']), 'amazon');
      assert.strictEqual(Completer.findCommonPrefix(['l', 'l', 'l']), 'l');
    });

    it('does not return common prefix if none found', function () {
      assert.strictEqual(Completer.findCommonPrefix(['dog', 'cat', 'cow']), '');
      assert.strictEqual(Completer.findCommonPrefix(['cat', 'cow', 'dog']), '');
      assert.strictEqual(Completer.findCommonPrefix(['cat', '', 'cat']), '');
    });
  });

  //-------------------------------------------------

  describe('findCompletions', function () {
    it('returns commonPrefix and matches', function () {
      assert.deepEqual(Completer.findCompletions('am', ['amazon', 'ambulance', 'amish']), ['am', 'amazon', 'ambulance', 'amish']);
      assert.deepEqual(Completer.findCompletions('a',  ['amazon', 'ambulance', 'amish']), ['am', 'amazon', 'ambulance', 'amish']);
      assert.deepEqual(Completer.findCompletions('a',  ['antidote', 'antigravity', 'spaceship']), ['anti', 'antidote', 'antigravity']);
    });

    it('returns itself if no matches', function () {
      assert.deepEqual(Completer.findCompletions('a',     ['dog', 'cat', 'cow']), ['a']);
      assert.deepEqual(Completer.findCompletions('anti',  ['dog', 'cat', 'cow']), ['anti']);
    });

    it('does not return duplicates if in matches', function () {
      assert.deepEqual(Completer.findCompletions('cat', ['catalog', 'cat', 'cathode']), ['cat', 'catalog', 'cathode']);
      assert.deepEqual(Completer.findCompletions('cat', ['cat']), ['cat']);
    });
  });
});

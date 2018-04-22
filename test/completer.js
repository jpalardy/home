/* global describe, it, before */
/* eslint */

const assert = require("assert");

const Completer = require("../src/js/completer");

describe("Completer", () => {
  describe("class", () => {
    before(function _before() {
      // all aliases as of 2018-02-10
      this.words = `
        g gt gim gmap w3w gfin tw yt
        b sh wa ddg wp mw ud emoji
        so cv am am.ca audible vpl bp leanpub
        ebooks-it libgen imdb yelp rt gh dh ls
        ch caniuse ann anidb cr fun nf heisig
        rd wr cnm fs api.nodejs api.express api.jq api.aws
        api.mdn meetup udemy
      `
        .trim()
        .split(/[ \n]+/);
      this.subject = new Completer(this.words);
    });

    it("contains words as given", function _test() {
      assert.deepEqual(this.subject.words, this.words);
    });

    it("starts without completions", function _test() {
      assert.deepEqual(this.subject.completions, []);
    });

    it("cycles through completions", function _test() {
      {
        const matches = this.subject.matches("c");
        const words = ["c", "cv", "ch", "caniuse", "cr", "cnm", "c", "cv", "ch"]; // keeps going...
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
      {
        const matches = this.subject.matches("am");
        const words = ["am", "am.ca", "am", "am.ca", "am"];
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
    });

    it("cycles through completions, skipSameFirst", function _test() {
      {
        const matches = this.subject.matches("c", {skipSameFirst: true});
        const words = ["cv", "ch", "caniuse", "cr", "cnm", "c", "cv", "ch"]; // keeps going...
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
      {
        const matches = this.subject.matches("am", {skipSameFirst: true});
        const words = ["am.ca", "am", "am.ca", "am"];
        words.forEach(word => assert.strictEqual(matches.next().value, word));
      }
    });
  });

  //-------------------------------------------------

  describe("findCommonPrefix", () => {
    it("returns [] for empty array", () => {
      assert.strictEqual(Completer.findCommonPrefix([]), "");
      assert.strictEqual(Completer.findCommonPrefix(), "");
    });

    it("returns first if array only contains one value", () => {
      assert.strictEqual(Completer.findCommonPrefix(["xxx"]), "xxx");
    });

    it("returns common prefix if found", () => {
      assert.strictEqual(Completer.findCommonPrefix(["amazon", "ambulance", "amish"]), "am");
    });

    it("returns common prefix if found, all same", () => {
      assert.strictEqual(Completer.findCommonPrefix(["amazon", "amazon", "amazon"]), "amazon");
      assert.strictEqual(Completer.findCommonPrefix(["l", "l", "l"]), "l");
    });

    it("does not return common prefix if none found", () => {
      assert.strictEqual(Completer.findCommonPrefix(["dog", "cat", "cow"]), "");
      assert.strictEqual(Completer.findCommonPrefix(["cat", "cow", "dog"]), "");
      assert.strictEqual(Completer.findCommonPrefix(["cat", "", "cat"]), "");
    });
  });

  //-------------------------------------------------

  describe("findCompletions", () => {
    it("returns commonPrefix and matches", () => {
      assert.deepEqual(Completer.findCompletions("am", ["amazon", "ambulance", "amish"]), ["am", "amazon", "ambulance", "amish"]);
      assert.deepEqual(Completer.findCompletions("a", ["amazon", "ambulance", "amish"]), ["am", "amazon", "ambulance", "amish"]);
      assert.deepEqual(Completer.findCompletions("a", ["antidote", "antigravity", "spaceship"]), ["anti", "antidote", "antigravity"]);
    });

    it("returns itself if no matches", () => {
      assert.deepEqual(Completer.findCompletions("a", ["dog", "cat", "cow"]), ["a"]);
      assert.deepEqual(Completer.findCompletions("anti", ["dog", "cat", "cow"]), ["anti"]);
    });

    it("does not return duplicates if in matches", () => {
      assert.deepEqual(Completer.findCompletions("cat", ["catalog", "cat", "cathode"]), ["cat", "catalog", "cathode"]);
      assert.deepEqual(Completer.findCompletions("cat", ["cat"]), ["cat"]);
    });

    it("does not return duplicates if same as commonPrefix", () => {
      assert.deepEqual(Completer.findCompletions("cat", ["cathode"]), ["cathode"]);
    });
  });
});

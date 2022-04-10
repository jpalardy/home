/* global require, describe, before, it */
/* eslint @typescript-eslint/no-var-requires: off */

const assert = require("assert");
const Completer = require("../dist/completer");

describe("Completer", () => {
  describe("init", () => {
    function assertWords(completions, words) {
      const completionWords = [completions.first].concat(completions.rest);
      assert.deepEqual(completionWords, words);
    }

    it("returns matches and commonPrefix", () => {
      assertWords(Completer.init(["amazon", "ambulance", "amish"], "am"), ["amazon", "ambulance", "amish", "am"]);
      assertWords(Completer.init(["amazon", "ambulance", "amish"], "a"), ["amazon", "ambulance", "amish", "am"]);
      assertWords(Completer.init(["antidote", "antigravity", "spaceship"], "a"), ["antidote", "antigravity", "anti"]);
    });

    it("returns itself if no matches", () => {
      assertWords(Completer.init(["dog", "cat", "cow"], "a"), ["a"]);
      assertWords(Completer.init(["dog", "cat", "cow"], "anti"), ["anti"]);
    });

    it("does not return extra commonPrefix if in matches", () => {
      assertWords(Completer.init(["catalog", "cat", "cathode"], "cat"), ["catalog", "cat", "cathode"]);
      assertWords(Completer.init(["cat"], "cat"), ["cat"]);
    });

    it("returns everything on blank", () => {
      assertWords(Completer.init(["amazon", "ambulance", "amish"], ""), ["amazon", "ambulance", "amish", "am"]);
      assertWords(Completer.init(["a", "b", "c"], ""), ["a", "b", "c", ""]);
    });

    it("returns full-and-only match", () => {
      assertWords(Completer.init(["amazon", "helicopter", "amish"], "h"), ["helicopter"]);
      assertWords(Completer.init(["cathode"], "cat"), ["cathode"]);
    });

    it("returns itself when matching nothing", () => {
      assertWords(Completer.init(["a", "b", "c"], "x"), ["x"]);
    });
  });

  describe("cycle", () => {
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
    });

    function assertWords(words, completions) {
      words.forEach((word) => {
        let value;
        [value, completions] = Completer.cycle(completions);
        assert.strictEqual(value, word);
      });
    }

    it("cycles through completions", function _test() {
      {
        let completions = Completer.init(this.words, "c");
        const words = ["cv", "ch", "caniuse", "cr", "cnm", "c", "cv", "ch"]; // keeps going...
        assertWords(words, completions);
      }
      {
        let completions = Completer.init(this.words, "am");
        const words = ["am", "am.ca", "am", "am.ca", "am"];
        assertWords(words, completions);
      }
      {
        let completions = Completer.init(["a", "b", "c"], "x");
        const words = ["x", "x", "x", "x"];
        assertWords(words, completions);
      }
    });

    it("cycles through completions, common prefix", function _test() {
      const words = ["api.nodejs", "api.express", "api.jq", "api.aws", "api.mdn", "api.", "api.nodejs", "api.express"];
      let completions = Completer.init(words, "ap");
      assertWords(words, completions);
    });
  });

  //-------------------------------------------------

  describe("findCommonPrefix", () => {
    it("returns word for empty array", () => {
      assert.strictEqual(Completer.findCommonPrefix("foo", []), "foo");
    });

    it("returns common prefix if found", () => {
      assert.strictEqual(Completer.findCommonPrefix("amazon", ["ambulance", "amish"]), "am");
    });

    it("returns common prefix if found, all same", () => {
      assert.strictEqual(Completer.findCommonPrefix("amazon", ["amazon", "amazon", "amazon"]), "amazon");
      assert.strictEqual(Completer.findCommonPrefix("l", ["l", "l", "l"]), "l");
    });

    it("does not return common prefix if none found", () => {
      assert.strictEqual(Completer.findCommonPrefix("foo", ["bar"]), "");
      assert.strictEqual(Completer.findCommonPrefix("dog", ["cat", "cow"]), "");
      assert.strictEqual(Completer.findCommonPrefix("cat", ["cow", "dog"]), "");
      assert.strictEqual(Completer.findCommonPrefix("cat", ["", "cat"]), "");
      assert.strictEqual(Completer.findCommonPrefix("", ["cow", "dog"]), "");
    });
  });
});

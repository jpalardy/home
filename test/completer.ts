import assert = require("assert");

import Completer = require("../src/ts/completer");
import {Completions} from "../src/ts/completer";

function assertWords(words: string[], completions: Completions) {
  words.forEach((word) => {
    let value: string;
    [value, completions] = Completer.cycle(completions);
    assert.strictEqual(value, word);
  });
}

describe("Completer", () => {
  describe("init", () => {
    it("returns matches and commonPrefix", () => {
      assertWords(["amazon", "ambulance", "amish", "am"], Completer.init(["amazon", "ambulance", "amish"], "am") );
      assertWords(["amazon", "ambulance", "amish", "am"], Completer.init(["amazon", "ambulance", "amish"], "a") );
      assertWords(["antidote", "antigravity", "anti"], Completer.init(["antidote", "antigravity", "spaceship"], "a") );
    });

    it("returns itself if no matches", () => {
      assertWords(["a"], Completer.init(["dog", "cat", "cow"], "a") );
      assertWords(["anti"], Completer.init(["dog", "cat", "cow"], "anti") );
    });

    it("does not return extra commonPrefix if in matches", () => {
      assertWords(["catalog", "cat", "cathode"], Completer.init(["catalog", "cat", "cathode"], "cat") );
      assertWords(["cat"], Completer.init(["cat"], "cat") );
    });

    it("returns everything on blank", () => {
      assertWords(["amazon", "ambulance", "amish", "am"], Completer.init(["amazon", "ambulance", "amish"], "") );
      assertWords(["a", "b", "c", ""], Completer.init(["a", "b", "c"], "") );
    });

    it("returns full-and-only match", () => {
      assertWords(["helicopter"], Completer.init(["amazon", "helicopter", "amish"], "h") );
      assertWords(["cathode"], Completer.init(["cathode"], "cat") );
    });

    it("returns itself when matching nothing", () => {
      assertWords(["x"], Completer.init(["a", "b", "c"], "x") );
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

    it("cycles through completions", function _test() {
      {
        const completions = Completer.init(this.words, "c");
        const words = ["cv", "ch", "caniuse", "cr", "cnm", "c", "cv", "ch"]; // keeps going...
        assertWords(words, completions);
      }
      {
        const completions = Completer.init(this.words, "am");
        const words = ["am", "am.ca", "am", "am.ca", "am"];
        assertWords(words, completions);
      }
      {
        const completions = Completer.init(["a", "b", "c"], "x");
        const words = ["x", "x", "x", "x"];
        assertWords(words, completions);
      }
    });

    it("cycles through completions, common prefix", function _test() {
      const words = ["api.nodejs", "api.express", "api.jq", "api.aws", "api.mdn", "api.", "api.nodejs", "api.express"];
      const completions = Completer.init(words, "ap");
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

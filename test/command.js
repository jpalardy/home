/* global describe, it */

const assert = require("assert");

const sites = require("../src/js/sites/websites");
const Command = require("../src/js/command")(sites, "ddg");

const assertURL = function(text, url) {
  const command = Command.parse(text);
  assert.strictEqual(command && command.url, url); // command && to test null
};

describe("Command", () => {
  describe("parse", () => {
    it("punts an empty query", () => {
      assertURL("", null);
    });

    it("punts a blank query", () => {
      assertURL("     ", null);
    });

    it("handles a one-word query", () => {
      assertURL("gim something", "https://www.google.com/search?q=something&tbm=isch");
    });

    it("handles a two-word query", () => {
      assertURL("gim some thing", "https://www.google.com/search?q=some+thing&tbm=isch");
    });

    it("handles a one-word query (default)", () => {
      assertURL("something", "https://duckduckgo.com/?q=something");
    });

    it("handles a two-word query (default)", () => {
      assertURL("some thing", "https://duckduckgo.com/?q=some+thing");
    });

    it("handles a site without a query", () => {
      assertURL("g", "https://www.google.com/");
    });

    it("handles worst case with bad spacing", () => {
      assertURL("    gim some     thing      ", "https://www.google.com/search?q=some+thing&tbm=isch");
    });

    it("handles alias without search -- putting search in hashtag", () => {
      assertURL("cnm something", "https://www.cinemaclock.com/bri/vancouver#something");
    });
  });

  describe("parse (legacy)", () => {
    it("does not handle site as a query", () => {
      assertURL("gim yim", "https://www.google.com/search?q=yim&tbm=isch");
    });

    it("does not handle site as a query, with a query", () => {
      assertURL("gim yim something", "https://www.google.com/search?q=yim+something&tbm=isch");
    });
  });
});

import assert = require("assert");

import {sites} from "../src/ts/sites";
import Command = require("../src/ts/command");

const assertURL = function (text: string, url: string) {
  const command = Command.parser(sites, "ddg")(text);
  assert.strictEqual(command.url, url);
};

describe("Command", () => {
  describe("parse", () => {
    it("punts an empty/blank query", () => {
      assertURL("", "https://duckduckgo.com");
      assertURL("     ", "https://duckduckgo.com");
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
      assertURL("g", "https://www.google.com");
    });

    it("handles worst case with bad spacing", () => {
      assertURL("    gim some     thing      ", "https://www.google.com/search?q=some+thing&tbm=isch");
    });

    it("handles alias without search -- putting search in hashtag", () => {
      assertURL("cnm something", "https://www.cinemaclock.com/bri/vancouver#something");
    });
  });

  describe("parse ytl mod", () => {
    it("handles full shorts URLs", () => {
      const equivalentQueries = [
        "https://www.youtube.com/shorts/di-4koYimic",
        "https://www.youtube.com/shorts/di-4koYimic?some=thing",
        "https://www.youtube.com/shorts/di-4koYimic?some=thing#t=0m10s",
        "https://youtube.com/shorts/di-4koYimic",
        "https://youtu.be/shorts/di-4koYimic",
        "https://m.youtube.com/shorts/di-4koYimic",
        "https://m.youtube.com/shorts/di-4koYimic?some=thing#t=0m10s",
      ];
      equivalentQueries.forEach((q) => {
        assertURL(`ytl ${q}`, "https://www.youtube.com/watch?v=di-4koYimic");
      });
    });

    it("passes through bad shorts URLs", () => {
      assertURL(
        "ytl https://www.youtube.com/whatever/di-4koYimic",
        "https://www.youtube.com/watch?v=https%3A%2F%2Fwww.youtube.com%2Fwhatever%2Fdi-4koYimic"
      );
      assertURL("ytl muffin", "https://www.youtube.com/watch?v=muffin");
    });

    it("visits on whitespace", () => {
      assertURL("ytl", "https://www.youtube.com");
      assertURL("ytl   ", "https://www.youtube.com");
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

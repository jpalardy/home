/* global describe, it */

const assert = require("assert");

const websites = require("../src/js/websites");
const docs = require("../src/js/docs");
const Completer = require("../src/js/completer");

describe("completer expectations for", () => {
  const sites = [...websites, ...docs];
  const completer = new Completer(sites.map(site => site.alias).sort());

  it("do => doc.", () => {
    const matches = completer.matches("do");
    assert.strictEqual(matches.next().value, "doc.");
  });
});

/* global describe, it */

const assert = require("assert");

const websites = require("../src/js/sites/websites");
const docs = require("../src/js/sites/docs");
const Completer = require("../src/js/completer");

describe("completer expectations for", () => {
  const sites = [...websites, ...docs];
  const completer = new Completer(sites.map(site => site.alias).sort());

  it(": => doc.", () => {
    const matches = completer.matches(":r");
    assert.strictEqual(matches.next().value, ":rust");
  });
});

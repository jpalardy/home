import assert = require("assert");

import * as Sites from "../src/ts/sites";

const someURL = "https://example.com/";

describe("Sites", () => {
  describe("assertSiteConfig", () => {
    it("works for objects with required keys", () => {
      assert.strictEqual(Sites.assertSiteConfig({alias: "xxx", visit: someURL}), true);
      assert.strictEqual(Sites.assertSiteConfig({alias: "xxx", search: someURL}), true);
      assert.strictEqual(Sites.assertSiteConfig({alias: "xxx", visit: someURL, search: someURL}), true);
    });

    it("fails for objects with missing keys", () => {
      assert.strictEqual(Sites.assertSiteConfig({}), false);
      assert.strictEqual(Sites.assertSiteConfig({visit: someURL, search: someURL}), false);
      assert.strictEqual(Sites.assertSiteConfig({alias: "xxx"}), false);
      assert.strictEqual(Sites.assertSiteConfig({alias: "xxx", other: someURL}), false);
    });

    it("fails for non-objects", () => {
      assert.strictEqual(Sites.assertSiteConfig(null), false);
      assert.strictEqual(Sites.assertSiteConfig(undefined), false);
      assert.strictEqual(Sites.assertSiteConfig(42), false);
      assert.strictEqual(Sites.assertSiteConfig("whatever"), false);
    });
  });
});

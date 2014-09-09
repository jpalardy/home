/* global Backbone, $, app */

(function (exports) {
  'use strict';

  exports.Workspace = Backbone.Router.extend({
    routes: {
      ":query": "search"
    },
    initialize: function (options) {
      this.deck = options.deck;
    },
    search: function (q) {
      q = decodeURIComponent(q.replace(/\+/g, "%20"));
      $('#search input').val(q);
      this.deck.set('filter', q);
    }
  });
}(app));

/* global Backbone, $ */

var app = {};

(function (exports) {
  'use strict';

  $(function () {
    var deck = exports.deck = new exports.Deck();
    exports.deck_view   = new exports.DeckView({model: deck, el: $('#cards')});
    exports.search_view = new exports.SearchView({model: deck, el: $('#search')});
    exports.workspace   = new exports.Workspace({deck: deck});
    Backbone.history.start();
    deck.fetch();

    $(document).keypress(function (e) {
      if (e.which === 47 || e.which === 104) { // / or h
        e.preventDefault();
        $('#search input').select().focus();
      }
    });
  });
}(app));

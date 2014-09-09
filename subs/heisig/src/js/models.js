/* global Backbone, app, _, starific */

(function (exports) {
  'use strict';

  var Card = Backbone.Model.extend({
    initialize: function () {
      this.set('tokens', _.flatten([
        this.tokenize(this.get('keyword')),
        this.get('no').toString(),
        this.get('kanji')
      ]));
    },
    tokenize: function (str) {
      // "muffin's" -> "muffin's muffin"
      var possessiveWord = function (word) {
        return [word, word.replace(/'s\b/, '')].join(' ');
      };
      return str.toLowerCase().replace(/-/g, ' ').
                               replace(/\w+'s\b/, possessiveWord).
                               replace(/[^a-z' ]/g, '').
                               trim().split(/\s+/);
    }
  });

  var Cards = Backbone.Collection.extend({
    model: Card
  });

  exports.Deck = Backbone.Model.extend({
    url: 'heisig.json',
    initialize: function () {
      this.set('cards', new Cards());
      this.on('change:filter', function (deck, query) {
        Backbone.history.navigate(query);
      });
    },
    parse: function (resp) {
      return {cards: new Cards(resp)};
    },
    filtered: function () {
      var query = this.get('filter');
      if (!query) {
        return this.get('cards');
      }
      var matchers = starific(query);
      return this.get('cards').filter(function (card) {
        return matchers.any(card.get('tokens'));
      });
    }
  });
}(app));

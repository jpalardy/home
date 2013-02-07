// Generated by CoffeeScript 1.4.0
(function() {
  var Card, Cards, Deck, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Card = (function(_super) {

    __extends(Card, _super);

    function Card() {
      return Card.__super__.constructor.apply(this, arguments);
    }

    return Card;

  })(Backbone.Model);

  Cards = (function(_super) {

    __extends(Cards, _super);

    function Cards() {
      return Cards.__super__.constructor.apply(this, arguments);
    }

    Cards.prototype.model = Card;

    return Cards;

  })(Backbone.Collection);

  Deck = (function(_super) {

    __extends(Deck, _super);

    function Deck() {
      return Deck.__super__.constructor.apply(this, arguments);
    }

    Deck.prototype.url = 'heisig.json';

    Deck.prototype.initialize = function() {
      var uniques;
      this.set('cards', new Cards());
      this.on('change:filter', function(deck, query) {
        return Backbone.history.navigate(query);
      });
      this.uniques = uniques = {};
      return this.on('change:cards', function(deck, cards) {
        var unique;
        unique = {};
        return cards.forEach(function(card) {
          uniques[card.get('no')] = card;
          return uniques[card.get('kanji')] = card;
        });
      });
    };

    Deck.prototype.parse = function(resp) {
      var result;
      return result = {
        cards: new Cards(resp)
      };
    };

    Deck.prototype.filtered = function() {
      var query, relaxed, unique;
      query = this.get('filter');
      if (!query) {
        return this.get('cards');
      }
      unique = this.uniques[query];
      if (unique) {
        return [unique];
      }
      try {
        query = new RegExp(query, "i");
      } catch (error) {
        return [];
      }
      relaxed = this.get('relaxed');
      return this.get('cards').filter(function(card) {
        var _ref;
        if (card.get('keyword').match(query)) {
          return true;
        }
        if (relaxed && ((_ref = card.get('primitives')) != null ? _ref.match(query) : void 0)) {
          return true;
        }
        return false;
      });
    };

    return Deck;

  })(Backbone.Model);

  root = this;

  root.Deck = Deck;

}).call(this);
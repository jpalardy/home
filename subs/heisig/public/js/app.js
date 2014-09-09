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
/* global Backbone, $, app, Mustache */

(function (exports) {
  'use strict';

  var CACHE = [];

  var pluralize = function (count, singular, plural) {
    plural = plural || singular + 's';
    return count + ' ' + (count === 1 ? singular : plural);
  };

  var highlight = function (sel, duration) {
    sel = $(sel);
    sel.addClass('highlighted');
    setTimeout(function () {
      sel.removeClass('highlighted');
    }, duration);
  };

  //-------------------------------------------------

  var CardView = Backbone.View.extend({
    className: 'card',
    template: $('#card-template').html(),
    render: function () {
      this.$el.html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    }
  });

  exports.DeckView = Backbone.View.extend({
    events: {
      'click a': 'select'
    },
    select: function (e) {
      e.preventDefault();
      var kno = $(e.target).text();
      $('#search input').val('');
      this.model.set('filter', '');
      var target = $("#card-" + kno);
      highlight(target, 2000);
      $(window).scrollTop(target.offset().top - 130);
    },
    initialize: function () {
      this.model.on('change', this.render, this);
    },
    render: function () {
      var cards = this.model.filtered();
      $('#count').html(pluralize(cards.length, 'kanji'));
      this.$el.html(cards.map(function (card) {
        var kno = card.get('no');
        if (!CACHE[kno]) {
          var cardView = new CardView({model: card, id: "card-" + card.get('no')});
          CACHE[kno] = cardView.render().el;
        }
        return CACHE[kno];
      }));
      return this;
    }
  });

  exports.SearchView = Backbone.View.extend({
    events: {
      'change':   'change',
      'click':    'change',
      'keypress': 'press'
    },
    change: function (e) {
      this.filter($(e.target).val());
    },
    press: function (e) {
      e.stopPropagation();
      if (e.which === 13) { // return
        e.preventDefault();
        this.change(e);
      }
    },
    filter: function (query) {
      return this.model.set('filter', query);
    }
  });
}(app));
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

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

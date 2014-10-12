/* global $, React, starific */

(function () {
  'use strict';

  var DeckFilter = React.createClass({
    getInitialState: function () {
      return {query: this.props.query};
    },
    setQuery: function (query) {
      location.hash = encodeURIComponent(query).replace(/%20/g, '+');
      this.setState({query: query});
    },
    render: function () {
      return React.DOM.div({},
        new SearchBar({query: this.state.query, setQuery: this.setQuery}),
        new Deck({cards: this.props.cards, query: this.state.query})
      );
    }
  });

  var SearchBar = React.createClass({
    handleSubmit: function (e) {
      e.preventDefault();
    },
    handleChange: function () {
      var query = this.refs.query.getDOMNode().value;
      this.props.setQuery(query);
    },
    render: function () {
      return React.DOM.div({id: 'content'},
        React.DOM.form({id: 'search', onSubmit: this.handleSubmit},
          React.DOM.input({type: 'search', ref: 'query', size: 35, autoFocus: 'autofocus', autoCapitalize: 'off', autoCorrect: 'off', results: 'results', value: this.props.query, onChange: this.handleChange})
        )
      );
    }
  });

  var Deck = React.createClass({
    render: function () {
      var query    = this.props.query;
      var matchers = starific(query);
      var cards    = this.props.cards;
      if (query) {
        cards = cards.filter(function (card) {
          return matchers.any(card.tokens);
        });
      }
      var count = "no kanjis";
      if (cards.length === 1) { count = "1 kanji"; }
      if (cards.length > 1)   { count = cards.length + " kanjis"; }
      return React.DOM.div({},
        React.DOM.span({id: 'count'}, count),
        React.DOM.div({className: 'cards'}, cards.map(Card))
      );
    },
  });

  var Card = React.createClass({
    render: function () {
      return React.DOM.div({className: 'card'},
        React.DOM.span({className: 'no'}, this.props.no),
        React.DOM.span({className: 'keyword'}, this.props.keyword),
        React.DOM.span({className: 'kanji'}, this.props.kanji)
      );
    }
  });

  $.getJSON('heisig.min.json', function (cards) {
    var tokenize = function (str) {
      // "muffin's" -> "muffin's muffin"
      var possessiveWord = function (word) {
        return [word, word.replace(/'s\b/, '')].join(' ');
      };
      return str.toLowerCase().replace(/-/g, ' ').replace(/\w+'s\b/, possessiveWord).replace(/[^a-z' ]/g, '').trim().split(/\s+/);
    };
    cards = cards.map(function (card, i) {
      var result = {};
      result.no      = String(i + 1);
      result.key     = 'card-' + result.no;
      result.kanji   = Object.keys(card)[0];
      result.keyword = card[result.kanji];
      result.tokens  = tokenize(result.keyword).concat([result.no, result.kanji]);
      return result;
    });
    var query = decodeURIComponent(location.hash.replace(/^#/, '').replace(/\+/g, "%20"));
    React.renderComponent(new DeckFilter({cards: cards, query: query}), document.getElementById('dump'));
  });
}());

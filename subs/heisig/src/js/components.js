/* global require, exports */

var React    = require('react');

var starific = require('./starific');

//-------------------------------------------------

var Card = exports.Card = React.createClass({
  render: function () {
    return React.createElement('div', {className: 'card'},
      React.createElement('span', {className: 'no'}, this.props.no),
      React.createElement('span', {className: 'keyword'}, this.props.keyword),
      React.createElement('span', {className: 'kanji'}, this.props.kanji)
    );
  }
});

var SearchBar = exports.SearchBar = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
  },
  handleChange: function () {
    var query = this.refs.query.getDOMNode().value;
    this.props.setQuery(query);
  },
  render: function () {
    return React.createElement('div', {id: 'content'},
      React.createElement('form', {id: 'search', onSubmit: this.handleSubmit},
        React.createElement('input', {type: 'search', ref: 'query', size: 35, autoFocus: 'autofocus', autoCapitalize: 'off', autoCorrect: 'off', results: 'results', value: this.props.query, onChange: this.handleChange})
      )
    );
  }
});

var Deck = exports.Deck = React.createClass({
  render: function () {
    var query    = this.props.query;
    if (!query.match(/[ *]$/)) {
      query = query + '*';
    }
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
    return React.createElement('div', {},
      React.createElement('span', {id: 'count'}, count),
      React.createElement('div', {className: 'cards'}, cards.map(function (card) { return React.createElement(Card, card); }))
    );
  },
});


exports.DeckFilter = React.createClass({
  getInitialState: function () {
    return {query: this.props.query};
  },
  setQuery: function (query) {
    location.hash = encodeURIComponent(query).replace(/%20/g, '+');
    this.setState({query: query});
  },
  render: function () {
    return React.createElement('div', {},
      React.createElement(SearchBar, {query: this.state.query, setQuery: this.setQuery}),
      React.createElement(Deck, {cards: this.props.cards, query: this.state.query})
    );
  }
});

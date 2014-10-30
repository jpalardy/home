/* global require */

var React = require('react');

var components = require('./components');

//-------------------------------------------------

var getJSON = function (url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback(JSON.parse(request.responseText));
    }
  };
  request.send();
};

getJSON('heisig.min.json', function (cards) {
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
  React.render(React.createElement(components.DeckFilter, {cards: cards, query: query}), document.getElementById('dump'));
});

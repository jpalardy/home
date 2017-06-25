/* global fetch, Vue, document, location, starific */

var app = new Vue({
  el: '#app',
  template: '#template',
  data: {
    query: "",
    allCards: [],
  },
  //-------------------------------------------------
  computed: {
    count() {
      if (this.cards.length === 0) { return "no kanjis"; }
      return (this.cards.length === 1 ? "1 kanji" : `${this.cards.length} kanjis`);
    },
    cards() {
      let query = this.query;
      if (!query.match(/[ *]$/)) {
        query += '*';
      }
      const matchers = starific(query);
      const cards    = this.allCards;
      if (!query) {
        return cards;
      }
      return cards.filter(card => matchers.any(card.tokens));
    },
  },
  //-------------------------------------------------
  watch: {
    query() {
      location.hash = encodeURIComponent(this.query).replace(/%20/g, '+');
      document.title = (this.query.trim() ? `Heisig: ${this.query}` : 'Heisig lookup');
    },
  },
  //-------------------------------------------------
  created() {
    // pick query from the URL
    this.query = decodeURIComponent(location.hash.replace(/^#/, '').replace(/\+/g, "%20"));
    // load JSON
    fetch('heisig.min.json').then(response => response.json()).then((cards) => {
      const tokenize = function (str) {
        // "muffin's" -> "muffin's muffin"
        const possessiveWord = function (word) {
          return [word, word.replace(/'s\b/, '')].join(' ');
        };
        return str.toLowerCase()
                  .replace(/-/g, ' ')
                  .replace(/\w+'s\b/, possessiveWord)
                  .replace(/[^a-z' ]/g, '')
                  .trim()
                  .split(/\s+/);
      };
      this.allCards = cards.map((card, i) => {
        const result = {};
        result.no      = `${i + 1}`;
        result.key     = `card-${result.no}`;
        result.kanji   = Object.keys(card)[0];
        result.keyword = card[result.kanji];
        result.tokens  = [...tokenize(result.keyword), result.no, result.kanji];
        return result;
      });
    }).catch((err) => {
      console.error(err);
    });
  },
});



$ ->
  window.deck = new Deck()
  deck_view   = new DeckView model: deck, el: $('#cards')
  search_view = new SearchView el: $('#search')
  deck.fetch()


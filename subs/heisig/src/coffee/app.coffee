
$ ->
  window.deck = new Deck()
  deck_view   = new DeckView model: deck, el: $('#cards')
  search_view = new SearchView model: deck, el: $('#search')
  workspace   = new Workspace()
  Backbone.history.start()
  deck.fetch()

  $(document).keypress (e) ->
    if e.which in [47,104] # / or h
      e.preventDefault()
      $('#search input').select().focus()


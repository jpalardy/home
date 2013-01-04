
CACHE = []

pluralize = (count, singular, plural="#{singular}s") ->
  if count is 1
    "#{count} #{singular}"
  else
    "#{count} #{plural}"

highlight = (sel, duration) ->
  sel = $(sel)
  sel.addClass("highlighted")
  setTimeout ->
    sel.removeClass("highlighted")
  , duration

#-------------------------------------------------

class CardView extends Backbone.View
  className: 'card'
  template: $('#card-template').html()

  render: ->
    @.$el.html Mustache.render @template, @model.toJSON()
    @

class DeckView extends Backbone.View
  initialize: ->
    @model.on 'change', @render, @

  render: ->
    cards = @model.filtered()
    $('#count').html pluralize(cards.length, "kanji")
    @.$el.html cards.map (card) ->
      kno = card.get('no')
      unless CACHE[kno]
        cardView = new CardView model: card, id: "card-#{card.get('no')}"
        CACHE[kno] = cardView.render().el
      CACHE[kno]
    @

class SearchView extends Backbone.View
  events:
    'keyup':  'change'
    'click':  'change'
    'submit': (e) -> e.preventDefault()

  initialize: ->
    @filter = _.debounce(@filter, 100)

  change: (e) ->
    query = $(e.target).val()
    @filter query

  filter: (query) ->
    deck.set 'filter', query

#-------------------------------------------------
root = this
root.DeckView = DeckView
root.SearchView = SearchView


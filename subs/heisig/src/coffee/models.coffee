
tokenizeCard = (card) ->
 card.get('keyword').toLowerCase().replace(/-/, ' ').replace(/[^a-z ]/g, '').trim().split(/\s+/)

tokenizeQuery = (str) ->
 str.toLowerCase().trim().split(/\s+/)

#-------------------------------------------------

class Card extends Backbone.Model
  initialize: ->
    @set 'tokens', tokenize(@)

class Cards extends Backbone.Collection
  model: Card

class Deck extends Backbone.Model
  url: 'heisig.json'

  initialize: ->
    @set 'cards', new Cards()
    @on 'change:filter', (deck, query) ->
      Backbone.history.navigate(query)
    @uniques = uniques = {}
    @on 'change:cards', (deck, cards) ->
      unique = {}
      cards.forEach (card) ->
        uniques[card.get('no')] = card
        uniques[card.get('kanji')] = card

  parse: (resp) ->
    result =
      cards: new Cards(resp)

  filtered: ->
    query = @get('filter')
    return @get('cards') unless query
    unique = @uniques[query]
    if unique
      return [unique]
    matchers = tokenizeQuery(query).map(starific.matcher)
    @get('cards').filter (card) ->
      return starific.match(matchers, card.get('tokens'))

#-------------------------------------------------
root = this
root.Deck = Deck


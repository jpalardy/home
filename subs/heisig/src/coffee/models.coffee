
class Card extends Backbone.Model
  initialize: ->
    @set 'tokens', @tokenize(@get 'keyword')

  tokenize: (str) ->
     str.toLowerCase().replace(/-/, ' ').replace(/[^a-z ]/g, '').trim().split(/\s+/)

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
    matchers = starific(query)
    @get('cards').filter (card) ->
      return matchers.any(card.get('tokens'))

#-------------------------------------------------
root = this
root.Deck = Deck


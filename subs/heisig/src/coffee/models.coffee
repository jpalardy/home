
class Card extends Backbone.Model

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
    try
      query = new RegExp(query, "i")
    catch error
      return []
    relaxed = @get('relaxed')
    @get('cards').filter (card) ->
      if card.get('keyword').match query
        return true
      if relaxed and card.get('primitives')?.match query
        return true
      false

#-------------------------------------------------
root = this
root.Deck = Deck


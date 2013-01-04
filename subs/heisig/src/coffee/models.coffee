
class Card extends Backbone.Model

class Cards extends Backbone.Collection
  model: Card

class Deck extends Backbone.Model
  url: 'heisig.json'

  initialize: ->
    @set 'cards', new Cards()
    @on 'change:filter', (deck, query) ->
      Backbone.history.navigate(query)

  parse: (resp) ->
    result =
      cards: new Cards(resp)

  filtered: ->
    query = @get('filter')
    return @get('cards') unless query
    try
      query = new RegExp(query, "i")
    catch error
      return []
    @get('cards').filter (card) ->
      if card.get('kanji').match query
        return true
      if card.get('keyword').match query
        return true
      if card.get('primitives')?.match query
        return true
      false

#-------------------------------------------------
root = this
root.Deck = Deck


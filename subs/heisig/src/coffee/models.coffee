
# "muffin's" -> "muffin's muffin"
possessiveWord = (word) ->
  [word, word.replace(/'s\b/, '')].join(' ')

#-------------------------------------------------

class Card extends Backbone.Model
  initialize: ->
    @set 'tokens', _.flatten [@tokenize(@get 'keyword'), @get('no').toString(), @get 'kanji']

  tokenize: (str) ->
     str.toLowerCase().replace(/-/, ' ').replace(/\w+'s\b/, possessiveWord).replace(/[^a-z' ]/g, '').trim().split(/\s+/)

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
    matchers = starific(query)
    cards = @get('cards').filter (card) ->
      return matchers.any(card.get('tokens'))

#-------------------------------------------------
root = this
root.Deck = Deck


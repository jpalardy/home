
par = require 'par'

process.stdin.resume()
par.read process.stdin, (err, cards) ->
  result = []
  cards.forEach (card, i) ->
    result.push
      no: i+1
      kanji: card[1]
      keyword: card[0]
  console.log JSON.stringify(result, null, 2)


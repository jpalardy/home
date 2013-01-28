
class Workspace extends Backbone.Router
  routes:
    ":query": "search"

  search: (q) ->
    $('#search input').val(q)
    console.log 'q (before)', q
    console.log 'q (after)', decodeURIComponent(q)
    deck.set 'filter', decodeURIComponent(q)

#-------------------------------------------------
root = this
root.Workspace = Workspace



class Workspace extends Backbone.Router
  routes:
    ":query": "search"

  search: (q) ->
    $('#search input').val(q)
    deck.set 'filter', q

#-------------------------------------------------
root = this
root.Workspace = Workspace


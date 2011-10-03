
class Command
  constructor: (@query='', @sites=[]) ->
    @links = for site in @sites
      if @query
        { site: site, url: Command.sites[site]['search'].replace(/%s/g, encodeURI(@query)) }
      else
        { site: site, url: Command.sites[site]['visit'] }
    @urls = for link in @links
      link.url

  toString: ->
    "#{@sites.join ","} #{@query}"

  @dealias: (text) ->
    aliases = text.split(',')
    sites = []
    for alias in aliases
      if Command.groups[alias]
        sites = sites.concat Command.groups[alias]
      else
        sites.push alias
    (site for site in sites when Command.sites[site])

  @parse: (text) ->
    words = (word for word in text.split(/\ +/) when word)
    return new Command if words.length is 0

    sites = @dealias words[0]
    if sites.length is 0
      sites = Command.default_sites
      query = words.join ' '
    else
      query = words.slice(1).join ' '

    new Command query, sites

#-------------------------------------------------

exports = exports ? this
exports.Command = Command


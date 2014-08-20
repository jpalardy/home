
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

  @parse: (text) ->
    words = (word for word in text.split(/\ +/) when word)
    return new Command if words.length is 0

    sites = (site for site in words[0].split(',') when Command.sites[site])
    if sites.length is 0
      sites = Command.default_sites
      query = words.join ' '
    else
      query = words.slice(1).join ' '

    new Command query, sites

#-------------------------------------------------

exports = exports ? this
exports.Command = Command


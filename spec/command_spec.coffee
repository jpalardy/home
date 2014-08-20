
Command = (require '../tmp/js/command').Command
sites   = (require '../config/sites.json')

sites_lut = {}
for site in sites
  sites_lut[site.alias] = site
Command.sites = sites_lut
Command.default_sites = ['ddg']

describe 'Command', ->

  describe 'constructor', ->
    it 'should construct properly', ->
      command = new Command 'something', ['gim','yim']
      (expect command.query).toEqual 'something'
      (expect command.sites).toEqual ['gim','yim']
      (expect command.links).toEqual [{site: 'gim', url: 'https://www.google.com/search?q=something&tbm=isch'},
                                      {site: 'yim', url: 'http://images.search.yahoo.com/search/images?p=something' }]
      (expect command.urls).toEqual  ['https://www.google.com/search?q=something&tbm=isch',
                                      'http://images.search.yahoo.com/search/images?p=something']

  describe 'parse', ->
    it 'should handle an empty query', ->
      command = Command.parse ''
      (expect command).toEqual null

    it 'should handle a blank query', ->
      command = Command.parse '      '
      (expect command).toEqual null

    it 'should handle a one-word query', ->
      command = Command.parse 'gim something'
      (expect command.urls).toEqual ['https://www.google.com/search?q=something&tbm=isch']

    it 'should handle a two-word query', ->
      command = Command.parse 'gim some thing'
      (expect command.urls).toEqual ['https://www.google.com/search?q=some%20thing&tbm=isch']

    it 'should handle a one-word query (default)', ->
      command = Command.parse('something')
      (expect command.urls).toEqual ['https://duckduckgo.com/?q=something']

    it 'should handle a two-word query (default)', ->
      command = Command.parse('some thing')
      (expect command.urls).toEqual ['https://duckduckgo.com/?q=some%20thing']

    it 'should handle a site without a query', ->
      command = Command.parse('g')
      (expect command.urls).toEqual ['https://www.google.com/']

    it 'should handle two sites without a query', ->
      command = Command.parse('g,yim')
      (expect command.urls).toEqual ['https://www.google.com/',
                                     'http://images.search.yahoo.com/search/images']

    it 'should handle two sites', ->
      command = Command.parse('gim,yim something')
      (expect command.urls).toEqual ['https://www.google.com/search?q=something&tbm=isch',
                                     'http://images.search.yahoo.com/search/images?p=something']

    it 'should ignore unknown sites', ->
      command = Command.parse('gim,unknown,yim something')
      (expect command.urls).toEqual ['https://www.google.com/search?q=something&tbm=isch',
                                     'http://images.search.yahoo.com/search/images?p=something']

  describe 'parse (legacy)', ->
    it 'should not handle two sites without a query', ->
      command = Command.parse('gim yim')
      (expect command.urls).toEqual ['https://www.google.com/search?q=yim&tbm=isch']

    it 'should not handle two sites', ->
      command = Command.parse('gim yim something')
      (expect command.urls).toEqual ['https://www.google.com/search?q=yim%20something&tbm=isch']

  describe 'toString', ->
    it 'should handle a one-word query', ->
      command = Command.parse 'gim something'
      (expect command.toString()).toEqual 'gim something'

    it 'should handle two sites', ->
      command = Command.parse('gim,yim something')
      (expect command.toString()).toEqual 'gim,yim something'


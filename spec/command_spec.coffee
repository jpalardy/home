
Command = (require '../tmp/js/command').Command
sites   = (require '../tmp/js/sites').sites

Command.sites = sites
Command.default_sites = ['ddg']
Command.groups =
  anime  : ['ann','anidb']
  images : ['yim','gim']

describe 'Command', ->

  describe 'constructor', ->
    it 'should construct properly', ->
      command = new Command 'something', ['gim','yim']
      (expect command.query).toEqual 'something'
      (expect command.sites).toEqual ['gim','yim']
      (expect command.links).toEqual [{site: 'gim', url: 'http://images.google.com/images?q=something'},
                                      {site: 'yim', url: 'http://images.search.yahoo.com/search/images?p=something' }]
      (expect command.urls).toEqual  ['http://images.google.com/images?q=something',
                                      'http://images.search.yahoo.com/search/images?p=something']

  describe 'parse', ->
    it 'should handle an empty query', ->
      command = Command.parse ''
      (expect command.query).toEqual ''
      (expect command.urls).toEqual []

    it 'should handle a blank query', ->
      command = Command.parse '      '
      (expect command.query).toEqual ''
      (expect command.urls).toEqual []

    it 'should handle a one-word query', ->
      command = Command.parse 'gim something'
      (expect command.urls).toEqual ['http://images.google.com/images?q=something']

    it 'should handle a two-word query', ->
      command = Command.parse 'gim some thing'
      (expect command.urls).toEqual ['http://images.google.com/images?q=some%20thing']

    it 'should handle a one-word query (default)', ->
      command = Command.parse('something')
      (expect command.urls).toEqual ['http://duckduckgo.com/?q=something']

    it 'should handle a two-word query (default)', ->
      command = Command.parse('some thing')
      (expect command.urls).toEqual ['http://duckduckgo.com/?q=some%20thing']

    it 'should handle a site without a query', ->
      command = Command.parse('gim')
      (expect command.urls).toEqual ['http://images.google.com/']

    it 'should handle two sites without a query', ->
      command = Command.parse('gim,yim')
      (expect command.urls).toEqual ['http://images.google.com/',
                                     'http://images.search.yahoo.com/search/images']

    it 'should handle two sites', ->
      command = Command.parse('gim,yim something')
      (expect command.urls).toEqual ['http://images.google.com/images?q=something',
                                     'http://images.search.yahoo.com/search/images?p=something']

    it 'should handle a group', ->
      command = Command.parse('images something')
      (expect command.urls).toEqual ['http://images.search.yahoo.com/search/images?p=something',
                                     'http://images.google.com/images?q=something']

    it 'should handle a site and a group', ->
      command = Command.parse('wp,images something')
      (expect command.urls).toEqual ['http://en.wikipedia.org/?search=something',
                                     'http://images.search.yahoo.com/search/images?p=something',
                                     'http://images.google.com/images?q=something']

    it 'should handle a group and a site', ->
      command = Command.parse('images,wp something')
      (expect command.urls).toEqual ['http://images.search.yahoo.com/search/images?p=something',
                                     'http://images.google.com/images?q=something',
                                     'http://en.wikipedia.org/?search=something']

    it 'should ignore unknown sites', ->
      command = Command.parse('gim,unknown,yim something')
      (expect command.urls).toEqual ['http://images.google.com/images?q=something',
                                     'http://images.search.yahoo.com/search/images?p=something']

  describe 'parse (legacy)', ->
    it 'should not handle two sites without a query', ->
      command = Command.parse('gim yim')
      (expect command.urls).toEqual ['http://images.google.com/images?q=yim']

    it 'should not handle two sites', ->
      command = Command.parse('gim yim something')
      (expect command.urls).toEqual ['http://images.google.com/images?q=yim%20something']

    it 'should not handle site and group', ->
      command = Command.parse('wp images something')
      (expect command.urls).toEqual ['http://en.wikipedia.org/?search=images%20something']

  describe 'toString', ->
    it 'should handle a one-word query', ->
      command = Command.parse 'gim something'
      (expect command.toString()).toEqual 'gim something'

    it 'should handle two sites', ->
      command = Command.parse('gim,yim something')
      (expect command.toString()).toEqual 'gim,yim something'

    it 'should handle a site and a group', ->
      command = Command.parse('wp,images something')
      (expect command.toString()).toEqual 'wp,yim,gim something'


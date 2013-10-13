
sites =
  # search -- google
  g:
    name:   'google'
    search: 'https://www.google.com/search?q=%s'
    visit:  'https://www.google.com/'
  gmail:
    name:   'gmail'
    search: 'https://mail.google.com/mail/?shva=1#search/%s'
    visit:  'https://mail.google.com/mail/?shva=1#inbox'
  gt:
    name:   'google translate'
    search: 'https://translate.google.com/#auto|en|%s'
    visit:  'https://translate.google.com/'
  gim:
    name:   'google image'
    search: 'https://www.google.com/search?q=%s&tbm=isch'
    visit:  'https://www.google.com/imghp?tbm=isch'
  gmap:
    name:   'google maps'
    search: 'https://maps.google.com/maps?oi=map&q=%s'
    visit:  'https://maps.google.com/'
  gfin:
    name:   'google finance'
    search: 'https://www.google.com/finance?q=%s'
    visit:  'https://www.google.com/finance'
  feedly:
    name:   'feedly'
    search: 'https://cloud.feedly.com/'
    visit:  'https://cloud.feedly.com/'
  yt:
    name:   'youtube'
    search: 'https://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search'
    visit:  'https://www.youtube.com/'

  # search -- yahoo
  yim:
    name:   'yahoo image'
    search: 'http://images.search.yahoo.com/search/images?p=%s'
    visit:  'http://images.search.yahoo.com/search/images'
  yfin:
    name:   'yahoo finance'
    search: 'http://finance.yahoo.com/q?s=%s'
    visit:  'http://finance.yahoo.com/'
  fl:
    name:   'flickr'
    search: 'https://www.flickr.com/photos/tags/%s'
    visit:  'https://www.flickr.com/'

  # search -- microsoft
  b:
    name:   'bing'
    search: 'http://www.bing.com/search?q=%s'
    visit:  'http://www.bing.com/'

  # search -- misc
  wa:
    name:   'wolfram alpha'
    search: 'https://www.wolframalpha.com/input/?i=%s'
    visit:  'https://www.wolframalpha.com/'
  ddg:
    name:   'duckduckgo'
    search: 'https://duckduckgo.com/?q=%s'
    visit:  'https://duckduckgo.com/'
  blk:
    name:   'blekko'
    search: 'https://blekko.com/ws/%s+/date'
    visit:  'https://blekko.com/'

  # reference
  wp:
    name:   'wikipedia'
    search: 'https://en.wikipedia.org/?search=%s'
    visit:  'https://en.wikipedia.org/'
  ud:
    name:   'urban dictionary'
    search: 'http://www.urbandictionary.com/define.php?term=%s'
    visit:  'http://www.urbandictionary.com/'
  ed:
    name:   'encyclopedia dramatica'
    search: 'http://encyclopediadramatica.ch/index.php?search=%s&fulltext=Search'
    visit:  'http://encyclopediadramatica.ch/Main_Page'
  so:
    name:   'stack overflow'
    search: 'http://stackoverflow.com/search?q=%s'
    visit:  'http://stackoverflow.com/'

  # books
  am:
    name:   'amazon.com'
    search: 'http://www.amazon.com/exec/obidos/external-search?mode=blended&keyword=%s'
    visit:  'http://www.amazon.com/'
  'am.ca':
    name:   'amazon.ca'
    search: 'http://www.amazon.ca/exec/obidos/external-search?mode=blended&keyword=%s'
    visit:  'http://www.amazon.ca/'
  isbn:
    name:   'isbn'
    search: 'http://isbn.nu/%s'
    visit:  'http://isbn.nu/'
  oreilly:
    name:   "o'reilly"
    search: 'http://search.oreilly.com/?q=%s&t1=Books'
    visit:  'http://oreilly.com/'
  safari:
    name:   'safari online'
    search: 'http://my.safaribooksonline.com/search/%s'
    visit:  'http://my.safaribooksonline.com/'
  apress:
    name:   'apress'
    search: 'http://apress.com/book/search?searchterm=%s'
    visit:  'http://www.apress.com/'
  banq:
    name:   'bibliothèque et archives nationales'
    search: 'http://us2kv5pk3n.search.serialssolutions.com/?V=1.0&S=T_W_A&C=%s'
    visit:  'http://www.banq.qc.ca/accueil/index.html?language_id=1'
  audible:
    name:   'audible'
    search: 'http://www.audible.com/search?advsearchKeywords=%s'
    visit:  'http://www.audible.com/'
  vpl:
    name:   'vpl'
    search: 'http://vpl.bibliocommons.com/search?t=smart&search_category=keyword&q=%s&searchOpt=catalogue'
    visit:  'http://www.vpl.ca/'

  bp:
    name:   'bookpiles'
    search: 'http://bookpiles.ca/jonathan/books#reading/%s'
    visit:  'http://bookpiles.ca/jonathan/books'

  # misc
  imdb:
    name:   'imdb'
    search: 'http://imdb.com/find?q=%s'
    visit:  'http://imdb.com/'
  da:
    name:   'deviant art'
    search: 'http://search.deviantart.com/?q=%s'
    visit:  'http://www.deviantart.com/'
  td:
    name:   'tigerdirect.ca'
    search: 'http://www.tigerdirect.ca/applications/SearchTools/search.asp?keywords=%s'
    visit:  'http://www.tigerdirect.ca/'
  yelp:
    name:   'yelp'
    search: 'http://www.yelp.com/search?find_desc=%s&find_loc=Montr%C3%A9al%2C+QC'
    visit:  'http://www.yelp.com/'
  gh:
    name:   'github'
    search: 'https://github.com/search?q=%s'
    visit:  'https://github.com/jpalardy'
  ls:
    name:   'yubnub'
    search: 'http://yubnub.org/kernel/ls?args=%s'
    visit:  'http://yubnub.org/'
  p:
    name:   'localhost port'
    search: 'http://localhost:%s/'
    visit:  'http://localhost/'

  # personal
  ann:
    name:   'anime news network',
    search: 'http://www.animenewsnetwork.com/encyclopedia/search.php?searchbox=%s'
    visit:  'http://www.animenewsnetwork.com/',
    hide:   true

  anidb:
    name:   'anidb',
    search: 'http://anidb.info/perl-bin/animedb.pl?adb.search=%s&show=animelist'
    visit:  'http://anidb.info/',
    hide:   true

  tot:
    name:   'tokyo toshokan',
    search: 'http://www.tokyotosho.info/search.php?terms=%s'
    visit:  'http://www.tokyotosho.info/',
    hide:   true

  tpb:
    name:   'the pirate bay',
    search: 'http://thepiratebay.org/search/%s/0/7/0'
    visit:  'http://thepiratebay.org/',
    hide:   true

  crunchy:
    name:   'crunchyroll',
    search: 'http://www.crunchyroll.com/search?q=%s'
    visit:  'http://www.crunchyroll.com/',
    hide:   true

  h:
    name:   'heisig',
    search: 'http://home.jpalardy.com/heisig/#%s',
    visit:  'http://home.jpalardy.com/heisig/'
    hide:   true

  rd:
    name:   'romajidesu',
    search: 'http://www.romajidesu.com/dictionary/meaning-of-%s.html',
    visit:  'http://www.romajidesu.com/'
    hide:   true

  netflix:
    name:   'netflix',
    search: 'http://movies.netflix.com/Search?v1=%s'
    visit:  'http://movies.netflix.com/WiHome',
    hide:   true

#-------------------------------------------------
exports = exports ? this
exports.sites = sites


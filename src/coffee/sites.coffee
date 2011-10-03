
sites =
  # search -- google
  g:
    name:   'google'
    search: 'http://www.google.com/search?q=%s'
    visit:  'http://www.google.com/'
  gmail:
    name:   'gmail'
    search: 'https://mail.google.com/mail/?shva=1#search/%s'
    visit:  'https://mail.google.com/mail/?shva=1#inbox'
  gr:
    name:   'google reader'
    search: 'https://www.google.com/reader/view/#search/%s/'
    visit:  'https://www.google.com/reader/view'
  gt:
    name:   'google translate'
    search: 'http://translate.google.com/#auto|en|%s'
    visit:  'http://translate.google.com/'
  gim:
    name:   'google image'
    search: 'http://images.google.com/images?q=%s'
    visit:  'http://images.google.com/'
  gmap:
    name:   'google maps'
    search: 'http://maps.google.com/maps?oi=map&q=%s'
    visit:  'http://maps.google.com/'
  gfin:
    name:   'google finance'
    search: 'http://finance.google.com/finance?q=%s'
    visit:  'http://finance.google.com/'
  yt:
    name:   'youtube'
    search: 'http://www.youtube.com/results?search_type=search_videos&search_sort=relevance&search_query=%s&search=Search'
    visit:  'http://www.youtube.com/'

  # search -- yahoo
  yim:
    name:   'yahoo'
    search: 'http://images.search.yahoo.com/search/images?p=%s'
    visit:  'http://images.search.yahoo.com/search/images'
  yfin:
    name:   'yahoo finance'
    search: 'http://finance.yahoo.com/q?s=%s'
    visit:  'http://finance.yahoo.com/'
  fl:
    name:   'flickr'
    search: 'http://flickr.com/photos/tags/%s'
    visit:  'http://flickr.com/'

  # search -- microsoft
  b:
    name:   'bing'
    search: 'http://www.bing.com/search?q=%s'
    visit:  'http://www.bing.com/'

  # search -- misc
  wa:
    name:   'wolfram alpha'
    search: 'http://www.wolframalpha.com/input/?i=%s'
    visit:  'http://www.wolframalpha.com/'
  ddg:
    name:   'duckduckgo'
    search: 'http://duckduckgo.com/?q=%s'
    visit:  'http://duckduckgo.com/'
  blk:
    name:   'blekko'
    search: 'http://blekko.com/ws/%s'
    visit:  'http://blekko.com/'

  # reference
  wp:
    name:   'wikipedia'
    search: 'http://en.wikipedia.org/?search=%s'
    visit:  'http://en.wikipedia.org/'
  ud:
    name:   'urban dictionary'
    search: 'http://www.urbandictionary.com/define.php?term=%s'
    visit:  'http://www.urbandictionary.com/'
  ed:
    name:   'encyclopedia dramatica'
    search: 'http://encyclopediadramatica.ch/index.php?search=%s&fulltext=Search'
    visit:  'http://encyclopediadramatica.ch/Main_Page'

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
    name:   'bibliothèque et archives nationales du québec'
    search: 'http://us2kv5pk3n.search.serialssolutions.com/?V=1.0&S=T_W_A&C=%s'
    visit:  'http://www.banq.qc.ca/accueil/index.html?language_id=1'
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

#-------------------------------------------------

exports = exports ? this
exports.sites = sites

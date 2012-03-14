
class Point
  constructor: (@x, @y) ->

class Region
  constructor: (p1, p2) ->
    @topLeft     = p1
    @topRight    = new Point(p2.x, p1.y)
    @bottomLeft  = new Point(p1.x, p2.y)
    @bottomRight = p2

  contains: (p) ->
    p.x >= @topLeft.x and p.x <= @bottomRight.x and
    p.y >= @topLeft.y and p.y <= @bottomRight.y

  overlaps: (r) ->
    @contains(r.topLeft)     or
    @contains(r.topRight)    or
    @contains(r.bottomLeft)  or
    @contains(r.bottomRight) or
    r.contains(@topLeft)     or # we usually won't get here, but we could if r surrounds "this"
    r.contains(@topRight)    or
    r.contains(@bottomLeft)  or
    r.contains(@bottomRight)

  padded: (t, r=t, b=t, l=r) ->
    new Region(new Point(@topLeft.x - l, @topLeft.y - t), new Point(@bottomRight.x + r, @bottomRight.y + b))

############################################################

shuffle = (sel) ->
  sel = $(sel)
  box = { width: sel.width(), height: sel.height() }

  overlap_iter = (region, regions) ->
    for r in regions
      return true if region.padded(10).overlaps(r)
    false

  region_for = (elem) ->
    elem = $(elem)
    w = elem.width()
    h = elem.height()
    x = Math.floor(Math.random() * (box.width - w))
    y = Math.floor(Math.random() * (box.height - h))
    new Region(new Point(x, y), new Point(x + w, y + h))

  regions = []
  sel.find('.item').each (i, elem) ->
    region = region_for(elem)
    while overlap_iter(region, regions)
      region = region_for(elem)
    regions.push(region)
    $(elem).animate({left: "#{region.topLeft.x}px", top:  "#{region.topLeft.y}px"}, 1000)

############################################################

$ ->
  shuffle('.scanny')

  $('button').click ->
    shuffle('.scanny')

  $(document).mousedown ->
    console.time "hold"

  $(document).mouseup ->
    console.timeEnd "hold"


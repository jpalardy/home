(function() {
  var Point, Region, shuffle;

  Point = (function() {

    function Point(x, y) {
      this.x = x;
      this.y = y;
    }

    return Point;

  })();

  Region = (function() {

    function Region(p1, p2) {
      this.topLeft = p1;
      this.topRight = new Point(p2.x, p1.y);
      this.bottomLeft = new Point(p1.x, p2.y);
      this.bottomRight = p2;
    }

    Region.prototype.contains = function(p) {
      return p.x >= this.topLeft.x && p.x <= this.bottomRight.x && p.y >= this.topLeft.y && p.y <= this.bottomRight.y;
    };

    Region.prototype.overlaps = function(r) {
      return this.contains(r.topLeft) || this.contains(r.topRight) || this.contains(r.bottomLeft) || this.contains(r.bottomRight) || r.contains(this.topLeft) || r.contains(this.topRight) || r.contains(this.bottomLeft) || r.contains(this.bottomRight);
    };

    Region.prototype.padded = function(t, r, b, l) {
      if (r == null) r = t;
      if (b == null) b = t;
      if (l == null) l = r;
      return new Region(new Point(this.topLeft.x - l, this.topLeft.y - t), new Point(this.bottomRight.x + r, this.bottomRight.y + b));
    };

    return Region;

  })();

  shuffle = function(sel) {
    var box, overlap_iter, region_for, regions;
    sel = $(sel);
    box = {
      width: sel.width(),
      height: sel.height()
    };
    overlap_iter = function(region, regions) {
      var r, _i, _len;
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        r = regions[_i];
        if (region.padded(10).overlaps(r)) return true;
      }
      return false;
    };
    region_for = function(elem) {
      var h, w, x, y;
      elem = $(elem);
      w = elem.width();
      h = elem.height();
      x = Math.floor(Math.random() * (box.width - w));
      y = Math.floor(Math.random() * (box.height - h));
      return new Region(new Point(x, y), new Point(x + w, y + h));
    };
    regions = [];
    return sel.find('.item').each(function(i, elem) {
      var region;
      region = region_for(elem);
      while (overlap_iter(region, regions)) {
        region = region_for(elem);
      }
      regions.push(region);
      return $(elem).animate({
        left: "" + region.topLeft.x + "px",
        top: "" + region.topLeft.y + "px"
      }, 1000);
    });
  };

  $(function() {
    shuffle('.scanny');
    $('button').click(function() {
      return shuffle('.scanny');
    });
    $(document).mousedown(function() {
      return console.time("hold");
    });
    return $(document).mouseup(function() {
      return console.timeEnd("hold");
    });
  });

}).call(this);

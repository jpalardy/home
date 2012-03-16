(function() {
  var KANJIS_DONE, KANJIS_TODAY, KANJIS_TOTAL, KANJI_PER_DAY;

  KANJIS_TOTAL = 2200;

  KANJI_PER_DAY = 6;

  KANJIS_TODAY = parseInt(moment().format("DDD"), 10) * KANJI_PER_DAY;

  KANJIS_DONE = parseInt(localStorage.getItem('KANJIS_DONE'), 10) || 0;

  jQuery(function() {
    var chart, data, h, m, updateProgress, updateValue, vis, w;
    w = 960;
    h = 50;
    m = [5, 20, 20, 10];
    chart = bulletChart().width(w - m[1] - m[3]).height(h - m[0] - m[2]);
    data = [
      {
        ranges: [KANJIS_TOTAL],
        measures: [0],
        markers: [0]
      }
    ];
    vis = d3.select("#chart").selectAll("svg").data(data).enter().append("svg").attr("class", "bullet").attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + m[3] + "," + m[0] + ")").call(chart);
    chart.duration(1000);
    setTimeout(function() {
      return vis.datum({
        ranges: [KANJIS_TOTAL],
        measures: [KANJIS_TODAY],
        markers: [0]
      }).call(chart);
    }, 100);
    updateProgress = function(value) {
      return vis.datum({
        ranges: [KANJIS_TOTAL],
        measures: [KANJIS_TODAY],
        markers: [value]
      }).call(chart);
    };
    setTimeout(function() {
      return updateProgress(KANJIS_DONE);
    }, 1100);
    updateValue = function() {
      KANJIS_DONE = parseInt($('#kanjis_done').attr('value'), 10) || 0;
      localStorage.setItem('KANJIS_DONE', KANJIS_DONE);
      return updateProgress(KANJIS_DONE);
    };
    $('#kanjis_done').attr('value', KANJIS_DONE).click(updateValue).change(updateValue);
    return $('form').submit(function(e) {
      return e.preventDefault();
    });
  });

}).call(this);

/* global $, d3 */

var w = 500;
var h = 500;
var padding = 10;

var MAX_DOTS = 100;

//-------------------------------------------------

var SlidingWindow = function (width) {
  this.width = width || 10;
  this.list  = [];
};

SlidingWindow.prototype.push = function (value) {
  this.list.push(value);
  if (this.list.length > this.width) {
    this.list.shift();
  }
};

var sw_src = new SlidingWindow(MAX_DOTS);
var sw_dst = new SlidingWindow(MAX_DOTS);

//-------------------------------------------------

var opacityScale = d3.scale.pow().exponent([4])
  .domain([0, MAX_DOTS])
  .range([0, 1]);

var xScale = d3.scale.linear()
    .domain([-10, 10])
    .range([padding, w - padding]);

var yScale = d3.scale.linear()
    .domain([-10, 10])
    .range([h - padding, padding]);

//-------------------------------------------------

var svg = d3.select("#grid")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat("")
    .tickSize(h - padding * 2)
    .ticks(21);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(-w + padding * 2)
    .tickFormat("")
    .ticks(20);

// grid lines
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + padding + ")")
    .call(xAxis);
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

// x/y axis
svg.append("line")
    .attr("class", "line")
    .attr("x1", w / 2)
    .attr("y1", 0)
    .attr("x2", w / 2)
    .attr("y2", h);

svg.append("line")
    .attr("class", "line")
    .attr("x1", 0)
    .attr("y1", h / 2)
    .attr("x2", w)
    .attr("y2", h / 2);

//-------------------------------------------------

// not general-case :-)
var matrix_x_vector = function (m, v) {
  return [m[0][0] * v[0] + m[0][1] * v[1],
          m[1][0] * v[0] + m[1][1] * v[1]];
};

var MATRIX = [
  [1, 0],
  [0, 1],
];

//-------------------------------------------------

svg.on("mousemove", function () {
  var mouse_xy = d3.mouse(this);
  var src_xy   = [xScale.invert(mouse_xy[0]), yScale.invert(mouse_xy[1])];
  var dst_xy   = matrix_x_vector(MATRIX, src_xy);

  if (sw_src.list.length === 0) {
    for (var i = 0; i < MAX_DOTS; i++) {
      sw_src.push(src_xy);
      sw_dst.push(dst_xy);
    }
    var enter_common = function (dot) {
      dot.attr("r", 5)
        .attr("cx", function (d) { return xScale(d[0]); })
        .attr("cy", function (d) { return yScale(d[1]); });
    };
    svg.selectAll('.dot_src')
      .data(sw_src.list)
      .enter().append("circle")
      .attr("class", "dot_src")
      .call(enter_common);
    svg.selectAll('.dot_dst')
      .data(sw_dst.list)
      .enter().append("circle")
      .attr("class", "dot_dst")
      .call(enter_common);
    return;
  }

  sw_src.push(src_xy);
  sw_dst.push(dst_xy);

  var data_common = function (dot) {
    dot.style("opacity", function (d, i) { return opacityScale(i); })
      .attr("cx", function (d) { return xScale(d[0]); })
      .attr("cy", function (d) { return yScale(d[1]); });
  };
  svg.selectAll('.dot_src')
    .data(sw_src.list)
    .call(data_common);
  svg.selectAll('.dot_dst')
    .data(sw_dst.list)
    .call(data_common);
});

//-------------------------------------------------

$('input').change(function () {
  var vals = [];
  $('input').each(function () {
    vals.push($(this).val());
  });
  vals = vals.map(Number);
  MATRIX[0] = vals.slice(0, 2);
  MATRIX[1] = vals.slice(2, 4);
});

$('#matrix a').click(function (e) {
  e.preventDefault();
  var vals = this.dataset.matrix.split(' ');
  MATRIX[0] = vals.slice(0, 2);
  MATRIX[1] = vals.slice(2, 4);
  $('input')[0].value = MATRIX[0][0];
  $('input')[1].value = MATRIX[0][1];
  $('input')[2].value = MATRIX[1][0];
  $('input')[3].value = MATRIX[1][1];
});


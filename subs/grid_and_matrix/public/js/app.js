/* global $, d3 */

var w = 500;
var h = 500;
var padding = 10;

var dots = [];
var MAX_DOTS = 50;
var push_dot = function (dot) {
  dots.push(dot); // add
  if (dots.length > MAX_DOTS) {
    dots = dots.slice(1, MAX_DOTS + 1); // pop first
  }
};

//-------------------------------------------------

var opacityScale = d3.scale.linear()
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

var current_xy;
svg.on("mousemove", function () {
  var mouse_xy = d3.mouse(this);
  var mouse_x = mouse_xy[0];
  var mouse_y = mouse_xy[1];
  var x = xScale.invert(mouse_x);
  var y = yScale.invert(mouse_y);
  current_xy = matrix_x_vector(MATRIX, [x, y]);
});

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

setInterval(function () {
  if (!current_xy) { return; }
  if (dots[dots.length - 1] === current_xy) {
    return;
  }

  if (dots.length === 0) {
    for (var i = 0; i < 50; i++) {
      dots.push(current_xy);
    }
  }
  push_dot(current_xy);

  svg.selectAll('.dot')
    .data(dots)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .style("fill", "steelblue")
    .attr("cx", function (d) {
      return xScale(d[0]);
    })
    .attr("cy", function (d) {
      return yScale(d[1]);
    });

  svg.selectAll('.dot')
    .data(dots)
    .style("opacity", function (d, i) { return opacityScale(i); })
    .attr("cx", function (d) {
      return xScale(d[0]);
    })
    .attr("cy", function (d) {
      return yScale(d[1]);
    });

}, 30);

//-------------------------------------------------



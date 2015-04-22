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

var update_matrix = function (a, b, c, d) {
  MATRIX = [
    [a, b],
    [c, d],
  ];
  draw_timmy();
};

//-------------------------------------------------

var timmy  = svg.append("g").attr("class", "timmy hide");

var timmy_line = function (x1, y1, x2, y2) {
  var scale = 1;
  timmy.append("line")
        .attr("class", "line")
        .attr("x1", xScale(x1 * scale))
        .attr("y1", yScale(y1 * scale))
        .attr("x2", xScale(x2 * scale))
        .attr("y2", yScale(y2 * scale));

  var t1 = matrix_x_vector(MATRIX, [x1, y1]);
  var t2 = matrix_x_vector(MATRIX, [x2, y2]);
  timmy.append("line")
        .attr("class", "line")
        .attr("opacity", "0.3")
        .attr("x1", xScale(t1[0] * scale))
        .attr("y1", yScale(t1[1] * scale))
        .attr("x2", xScale(t2[0] * scale))
        .attr("y2", yScale(t2[1] * scale));
};

var draw_timmy = function () {
  timmy.selectAll('line').remove();
  timmy_line(0, 0, 1, 1); // left leg
  timmy_line(1, 1, 2, 0); // right leg
  timmy_line(1, 1, 1, 3); // torso
  timmy_line(1, 2, 0, 1.5); // left arm
  timmy_line(1, 2, 2, 2.5); // right arm
  timmy_line(0.25, 3, 1.75, 3); // head
  timmy_line(0.25, 4.5, 1.75, 4.5); // head
  timmy_line(0.25, 3, 0.25, 4.5); // head
  timmy_line(1.75, 3, 1.75, 4.5); // head
};
draw_timmy();

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
  update_matrix.apply(null, vals);
});

var timmy_hide = true;
$('#matrix button').click(function () {
  // hmmm... toggleClass doesn't work for SVG
  if (timmy_hide) {
    $('.timmy').attr('class', 'timmy');
  } else {
    $('.timmy').attr('class', 'timmy hide');
  }
  timmy_hide = !timmy_hide;
});

$('#matrix a').click(function (e) {
  e.preventDefault();
  var vals = this.dataset.matrix.split(' ');
  update_matrix.apply(null, vals);
  $('input')[0].value = MATRIX[0][0];
  $('input')[1].value = MATRIX[0][1];
  $('input')[2].value = MATRIX[1][0];
  $('input')[3].value = MATRIX[1][1];
});


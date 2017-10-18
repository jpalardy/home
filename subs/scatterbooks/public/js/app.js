/* global document, d3, Vue, fetch */

const DURATION = 1000;

const scales = {};
let svg;

const scaleAxisX = function (domain) {
  scales.x.domain(domain);
  svg.select('.x-axis')
    .transition().duration(DURATION)
    .call(d3.axisBottom(scales.x));
};

const scaleAxisY = function (domain) {
  scales.y.domain(domain);
  svg.select('.y-axis')
    .transition().duration(DURATION)
    .call(d3.axisLeft(scales.y));
};

const updateBooks = function (books) {
  const oldScaleX = scales.x.copy();
  const oldScaleY = scales.y.copy();

  if (books.length > 0) {
    scaleAxisX([0, d3.max(books, book => book.pages)]);
    scaleAxisY([0, d3.max(books, book => book.ml)]);
  }

  const data = svg.selectAll("circle").data(books, book => book.image_url);
  data.enter()
    .append("circle")
    .attr("r", 3)
    .attr("fill", d => scales.color(d.year))
    .attr("cx", d => oldScaleX(d.pages))
    .attr("cy", d => oldScaleY(d.ml))
    .transition().duration(DURATION)
    .attr("cx", d => scales.x(d.pages))
    .attr("cy", d => scales.y(d.ml));
  data
    .transition().duration(DURATION)
    .attr("cx", d => scales.x(d.pages))
    .attr("cy", d => scales.y(d.ml));

  data.exit()
    .remove();
};

//-------------------------------------------------

const renderBooks = function (books, years) {
  const WIDTH  = 500;
  const HEIGHT = 500;
  const margin = {
    top:    10,
    right:  10,
    bottom: 25,
    left:   40,
  };
  const width  = WIDTH  - margin.left - margin.right;
  const height = HEIGHT - margin.top - margin.bottom;

  scales.x = d3.scaleLinear()
    .range([0, width]);

  scales.y = d3.scaleLinear()
    .range([height, 0]);

  scales.color = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeCategory10);

  const tooltip = document.querySelector('#tooltip');
  document.addEventListener('mouseover', (ev) => {
    if (ev.target.tagName !== 'circle') {
      return;
    }
    const data = ev.target.__data__;
    tooltip.style.left = `${ev.pageX + 10}px`;
    tooltip.style.top  = `${ev.pageY - 10}px`;
    tooltip.onload = () => {
      tooltip.style.display = "block";
    };
    tooltip.src = `https://bookpiles.ca${data.image_url}`;
  });
  document.addEventListener('mouseout', () => {
    tooltip.style.display = "none";
  });
  document.addEventListener('click', (ev) => {
    if (ev.target.tagName !== 'circle') {
      return;
    }
    const data = ev.target.__data__;
    app.selectedYears = app.selectedYears.filter(year => year !== data.year);
    tooltip.style.display = "none";
  });

  svg = d3.select("svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg.append('g')
    .attr("class", "axis y-axis")
    .append("text")
    .attr('transform', 'translate(10, 0) rotate(-90)')
    .attr('fill-opacity', 0.5)
    .text('volume (ml)');

  svg.append('g')
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`)
    .append("text")
    .attr('transform', `translate(${width - 12}, -5)`)
    .attr('fill-opacity', 0.5)
    .text('pages');

  scaleAxisX([0, d3.max(books, book => book.pages)]);
  scaleAxisY([0, d3.max(books, book => book.ml)]);
};

//-------------------------------------------------

const app = new Vue({
  el: '#app',
  template: '#template',
  data: {
    books: [],
    years: [],
    selectedYears: [],
  },
  //-------------------------------------------------
  computed: {
    filteredBooks() {
      return this.books.filter(book => this.selectedYears.includes(book.year));
    },
  },
  //-------------------------------------------------
  watch: {
    selectedYears() {
      updateBooks(this.filteredBooks);
    },
  },
  //-------------------------------------------------
  created() {
    fetch('data/books.json').then(response => response.json()).then((books) => {
      this.books = books;
      this.years = [...new Set(books.map(book => book.year))].sort();
      this.selectedYears = this.years;
      renderBooks(this.books, this.years);
    });
  },
});


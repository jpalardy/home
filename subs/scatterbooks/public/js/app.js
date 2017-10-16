/* global document, fetch, d3 */

fetch('data/books.json').then(response => response.json()).then((books) => {
  const WIDTH  = 800;
  const HEIGHT = 800;
  const margin = {
    top:    10,
    right:  10,
    bottom: 25,
    left:   40,
  };
  const width  = WIDTH  - margin.left - margin.right;
  const height = HEIGHT - margin.top - margin.bottom;

  const YEARS = [...new Set(books.map(book => book.year))].sort();

  const scalex = d3.scaleLinear()
    .domain([0, d3.max(books, book => book.pages)])
    .range([0, width]);

  const scaley = d3.scaleLinear()
    .domain([0, d3.max(books, book => book.ml)])
    .range([height, 0]);

  const scaleColor = d3.scaleOrdinal()
    .domain(YEARS)
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

  document.addEventListener('mouseover', () => {
    tooltip.style.display = "none";
  });

  const svg = d3.select("svg")
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  svg
    //.append("rect")
    //.attr("x", 0).attr("y", 0)
    //.attr("width", width).attr("height", height)
    //.attr("fill", "orange")
    .selectAll("circle")
    .data(books)
    .enter()
    .append("circle")
    .attr("cx", d => scalex(d.pages))
    .attr("cy", d => scaley(d.ml))
    .attr("r", 3)
    .attr("fill", d => scaleColor(d.year));

  const axisy = d3.axisLeft(scaley);
  svg.append('g')
    .attr("class", "axis")
    //.attr("transform", `translate(0,0)`)
    .call(axisy);

  const axisx = d3.axisBottom(scalex);
  svg.append('g')
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(axisx);
});


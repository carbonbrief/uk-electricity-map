// set the dimensions and margins of the graph
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x2 = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var y2 = d3.scaleLinear()
    .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("./data/bar.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  x2.domain(data.map(function(d) { return d.year; }));
  y2.domain([0, d3.max(data, function(d) { return d.value; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x2(d.year); })
      .attr("width", x2.bandwidth())
      .attr("y", function(d) { return y2(d.value); })
      .attr("height", function(d) { return height - y2(d.value); });

//   // add the x Axis
//   svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//   // add the y Axis
//   svg.append("g")
//       .call(d3.axisLeft(y));

});
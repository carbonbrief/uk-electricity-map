function getHeight () {
    if (screenWidth > 1200) {
        return 280
    } else if (screenWidth < 1200  && screenWidth > 1100) {
        return 260
    } else if (screenWidth < 1100  && screenWidth > 1000) {
        return 240
    } else if (screenWidth < 1000  && screenWidth > 900) {
        return 220
    }
}
console.log(screenWidth);

var responsiveHeight = getHeight();

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 30, left: 25},
    width = parseInt(d3.select("#line-wrapper").style("width")) - margin.left - margin.right,
    height = responsiveHeight - margin.top - margin.bottom;

var x2 = d3.scaleBand()
    .range([0, width])
    .padding(0.01);

var y2 = d3.scaleLinear()
    .range([height, 0]);
          
// append the svg object to the body of the page. need to do it only once for the line and bar background

var svg2 = d3.select("#bar-chart").append("svg")
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
  svg2.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x2(d.year); })
      .attr("width", x2.bandwidth())
      .attr("y", function(d) { return y2(d.value); })
      .attr("height", function(d) { return height - y2(d.value); })
      .style("opacity", 0);

    svg2.selectAll(".bar")
      .filter(function(d) { return d.year == 2017 })
      .transition()
      .duration(800)
      .style("opacity", 1);

//   not adding any axes since just for highlighting


});


// link behaviour to slider
// will just be changing opacity, so can avoid filtering data I think

d3.selectAll(".row").on("input", highlightYear);

function highlightYear() {

    var thisYear = this.value;

    svg2.selectAll(".bar")
        .style("opacity", 0);

    svg2.selectAll(".bar")
        .filter(function(d) { if (thisYear == 2018) {
            // highlight jumps two spaces ahead for planned plants
            return d.year == 2019
        } else {
            return d.year == thisYear
        }})
        .style("opacity", 1);


    //console.log(thisYear);
}
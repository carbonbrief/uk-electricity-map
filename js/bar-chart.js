function getHeight () {
    if ($width > 1279) {
        return 265;
    } else {
        return 225;
    }
}

function getWidth2 () {
    if ($width > 1279) {
        return 410;
    } else {
        return 390;
    }
}

// set the dimensions and margin2s of the graph
var margin2 = {top: 10, right: 10, bottom: 30, left: 35},
    width2 = getWidth2() - margin2.left - margin2.right,
    height2 = getHeight() - margin2.top - margin2.bottom;

var x2 = d3.scaleBand()
    .range([0, width2])
    .padding(0.01);

var y2 = d3.scaleLinear()
    .range([height2, 0]);

// append the svg object to the body of the page. need to do it only once for the line and bar background

var svg2 = d3.select("#bar-chart").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", 
        "translate(" + margin2.left + "," + margin2.top + ")");

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
        .attr("height", function(d) { return height2 - y2(d.value); })
        .style("opacity", 0);

    svg2.selectAll(".bar")
        .filter(function(d) { return d.year == 2018 })
        .transition()
        .duration(800)
        .style("opacity", 1);


});


// link behaviour to slider
// will just be changing opacity, so can avoid filtering data I think

d3.selectAll(".slider").on("input", highlightYear);

function highlightYear() {

    var thisYear = this.value;

    svg2.selectAll(".bar")
        .style("opacity", 0);

    svg2.selectAll(".bar")
        .filter(function(d) { if (thisYear == 2019) {
            // highlight jumps two spaces ahead for planned plants
            return d.year == 2020
        } else {
            return d.year == thisYear
        }})
        .style("opacity", 1);

}


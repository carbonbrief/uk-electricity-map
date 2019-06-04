const sparkMargin = {top: 5, right: 30, bottom: 5, left: 30},
    sparkWidth = 200 - sparkMargin.left - sparkMargin.right,
    sparkHeight = 50 - sparkMargin.top - sparkMargin.bottom;

const sparkData = [495, 446, 457, 441, 484, 452, 401, 332, 256, 226, 207];

const sparkX = d3.scaleLinear()
    .domain([0, sparkData.length])
    .range([0, sparkWidth]);

const sparkY = d3.scaleLinear()
    .domain([200, 500])
    .range([sparkHeight, 0]);

const sparkLine = d3.line()
    .x(function(d, i) { return sparkX(i); })// set the x values for the line generator
    .y(function(d) { return sparkY(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX);

const sparkSvg = d3.selectAll(".sparkline").append("svg")
    .attr("width", sparkWidth + sparkMargin.left + sparkMargin.right)
    .attr("height", sparkHeight + sparkMargin.top + sparkMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + sparkMargin.left + "," + sparkMargin.top + ")");

console.log("sparkline");
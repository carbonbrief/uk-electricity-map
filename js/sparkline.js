const data = [495, 446, 457, 441, 484, 452, 401, 332, 256, 226, 207];

const sparkMargin = {top: 5, right: 30, bottom: 5, left: 30},
    sparkWidth = 200 - sparkMargin.left - sparkMargin.right,
    sparkHeight = 50 - sparkMargin.top - sparkMargin.bottom;

const xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, sparkWidth]);

const yScale = d3.scaleLinear()
    .domain([200, 500])
    .range([height, 0]);

const line = d3.line()
    .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX);
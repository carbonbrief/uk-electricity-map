const sparkMargin = {top: 5, right: 30, bottom: 5, left: 30},
    sparkWidth = 180 - sparkMargin.left - sparkMargin.right,
    sparkHeight = 40 - sparkMargin.top - sparkMargin.bottom;

const sparkData = [{
        "xVal": 2008,
        "yVal": 495
    },{
        "xVal": 2009,
        "yVal": 446
    },{
        "xVal": 2010,
        "yVal": 457
    },{
        "xVal": 2011,
        "yVal": 441
    },{
        "xVal": 2012,
        "yVal": 484
    },{
        "xVal": 2013,
        "yVal": 452
    },{
        "xVal": 2014,
        "yVal": 401
    },{
        "xVal": 2015,
        "yVal": 332
    },{
        "xVal": 2016,
        "yVal": 256
    },{
        "xVal": 2017,
        "yVal": 226
    },{
        "xVal": 2018,
        "yVal": 207
}];

const sparkX = d3.scaleLinear()
    .domain([2008, 2018])
    .range([0, sparkWidth]);

const sparkY = d3.scaleLinear()
    .domain([200, 500])
    .range([sparkHeight, 0]);

const sparkLine = d3.line()
    .x(function(d) { 
        return sparkX(d.xVal); 
    })
    .y(function(d) { return sparkY(d.yVal); })
    .curve(d3.curveMonotoneX);

const sparkSvg = d3.selectAll(".sparkline").append("svg")
    .attr("width", sparkWidth + sparkMargin.left + sparkMargin.right)
    .attr("height", sparkHeight + sparkMargin.top + sparkMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + sparkMargin.left + "," + sparkMargin.top + ")");

sparkSvg.append("path")
    .datum(sparkData)
    .attr("class", "sparkPath")
    .attr("d", sparkLine);

sparkSvg.append("circle")
    .attr("cx", sparkX(2008))
    .attr("cy", sparkY(sparkData[0].yVal))
    .attr("r", 3)
    .attr("class", "sparkCircle");

sparkSvg.append("circle")
    .attr("cx", sparkX(2018))
    .attr("cy", sparkY(sparkData.slice(-1)[0].yVal))
    .attr("r", 3)
    .attr("class", "sparkCircle");

sparkSvg.append("text")
    .attr("x", (sparkX(2008) - 8))
    .attr("y", sparkY(495))
    .attr("dominant-baseline", "central")
    .attr("class", "sparkText")
    .attr("text-anchor", "end")
    .text("495");

sparkSvg.append("text")
    .attr("x", (sparkX(2018) + 8))
    .attr("y", sparkY(207))
    .attr("dominant-baseline", "central")
    .attr("class", "sparkText")
    .text("207");

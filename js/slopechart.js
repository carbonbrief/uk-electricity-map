const slopeMargin = {top: 20, right: 20, bottom: 30, left: 30},
    slopeWidth = 300 - slopeMargin.left - slopeMargin.right,
    slopeHeight = 300 - slopeMargin.top - slopeMargin.bottom;

let slopeColor = d3.scaleOrdinal()
// note that the order needs to be the same as the column headers in the CSV or the colours mess up
.range(["#ced1cc", "#a45edb", "#cc9b7a", "#dd54b6", "#43cfef", "#00a98e", "#ffc83e", "#A7B734", "#ea545c", '#ff8767']);

let slopeX = d3.scaleTime()
    .range([0, slopeWidth]);

let slopeY = d3.scaleLinear()
    .range([slopeHeight, 0]);

let slopeXAxis = d3.axisBottom(slopeX);

let slopeYAxis = d3.axisLeft(slopeY);

const slopeLine = d3.line()
    .curve(d3.curveLinear) // see http://bl.ocks.org/emmasaunders/c25a147970def2b02d8c7c2719dc7502 for more details
    .x(function(d) { return slopeX(d.year); })
    .y(function(d) { return slopeY(d.generation); });

const slopeSVG = d3.select("#slopechart").append("svg")
    .attr("width", slopeWidth + slopeMargin.left + slopeMargin.right)
    .attr("height", slopeHeight + slopeMargin.top + slopeMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + slopeMargin.left + "," + slopeMargin.top + ")");

function drawSlopeChart() {
    d3.csv("./data/slope-chart.csv", function(data) {
        console.log(data);

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

        data.forEach(function(d) {
            d.Year = parseDate(d.Year);
        });

        let lines = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.Year, 
                    capacity: +d[name]
                };
            })
            };
        });

        slopeX.domain([
            parseDate2(20070701), parseDate2(20180701)
        ]);

        slopeY.domain([
            d3.min(lines, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(lines, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })
        ]);

        slopeSVG.selectAll(".slopeLine")
        .data(lines)
        .enter()
        .append("path")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });



    });
};

drawSlopeChart();
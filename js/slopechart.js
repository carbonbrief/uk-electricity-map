const slopeMargin = {top: 20, right: 20, bottom: 30, left: 30},
    slopeWidth = 300 - slopeMargin.left - slopeMargin.right,
    slopeHeight = 200 - slopeMargin.top - slopeMargin.bottom;

let slopeColor = d3.scaleOrdinal()
// note that the order needs to be the same as the column headers in the CSV or the colours mess up
.range(["#ced1cc", "#a45edb", "#cc9b7a", "#dd54b6", "#43cfef", "#00a98e", "#ffc83e", "#A7B734", "#ea545c", '#ff8767']);

let slopeX = d3.scaleTime()
    .range([0, slopeWidth]);

let slopeY = d3.scaleLinear()
    .range([slopeHeight, 0]);

let slopeXAxis = d3.axisBottom(slopeX).tickValues([parseDate(2008), parseDate(2018)]);

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
            d.year = parseDate(d.Year);
        });

        let lines = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    generation: +d[name]
                };
            })
            };
        });

        slopeX.domain([
            parseDate(2005), parseDate(2021)
        ]);

        slopeY.domain([
            0,
            d3.max(lines, function(c) { return d3.max(c.values, function(v) { return v.generation; }); })
        ]);

        slopeSVG.selectAll(".slopeLine")
            .data(lines)
            .enter()
            .append("path")
            .attr("class", "slopeLine")
            .attr("d", function(d) { return slopeLine(d.values); })
            .style("stroke", function(d) { return slopeColor(d.name); });

        console.log(lines);

        slopeSVG.selectAll(".slopeCircle1")
            .data(lines)
            .enter()
            .append("circle")
            .attr("class", "slopeCircle1")
            .attr("r", 3)
            .attr("cx", function(d) {
                console.log(d.values[0]);
                console.log(slopeX(parseDate(d.values[0])));
                return slopeX(d.values[0].year); 
            })
            .attr("cy", function(d) { return slopeY(d.values[0].generation); })
            .style("fill", function(d) { return slopeColor(d.name); });

        slopeSVG.selectAll(".slopeCircle2")
            .data(lines)
            .enter()
            .append("circle")
            .attr("class", "slopeCircle2")
            .attr("r", 3)
            .attr("cx", function(d) {
                return slopeX(d.values[1].year); 
            })
            .attr("cy", function(d) { return slopeY(d.values[1].generation); })
            .style("fill", function(d) { return slopeColor(d.name); });

        slopeSVG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + slopeHeight + ")")
            .call(slopeXAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        slopeSVG.append("g")
            .attr("class", "y axis")
            .call(slopeYAxis);

        slopeSVG.append("text")
            .attr("class", "axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .text("Generation (Twh)");

        slopeSVG.selectAll(".slopeLabel")
            .data(lines)
            .enter()
            .append("text")
            .text(function(d) {
                return d.name;
            });




    });
};

$(document).ready(function() {
    drawSlopeChart();
});
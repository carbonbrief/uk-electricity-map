// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

var margin = {top: 30, right: (parseInt(d3.select("#stacked-bar").style("width")) - 35 - getWidth()), bottom: 10, left: 45},
    width = getWidth(),
    height = parseInt(d3.select("#stacked-bar").style("height")) - margin.top - margin.bottom;

function getWidth () {
    if ($width > 1280) {
        return 30;
    } else {
        return 25;
    }
}

var svg = d3.select('#stacked-bar').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(".1f");

var x = d3.scaleBand()			
    .rangeRound([0, width])	
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()		
    .rangeRound([0, height]);	

var z = d3.scaleOrdinal()
    .range(["#A7B734", "#ced1cc", "#cc9b7a", "#43cfef", '#ff8767', "#dd54b6", "#a45edb", "#4e80e5", "#ffc83e", "#ea545c", "#00a98e"]);

var stack = d3.stack();

var labels = {
    "rgb(167, 183, 52)": "Biomass",
    "rgb(206, 209, 204)": "Coal",
    "rgb(78, 128, 229)": "Storage",
    "rgb(67, 207, 239)": "Hydro",
    "rgb(255, 135, 103)": "Interconnectors",
    "rgb(221, 84, 182)": "Nuclear",
    "rgb(164, 94, 219)": "Oil",
    "rgb(204, 155, 122)": "Gas",
    "rgb(255, 200, 62)": "Solar",
    "rgb(234, 84, 92)": "Waste",
    "rgb(0, 169, 142)": "Wind"
}

d3.csv("./data/stacked-bar.csv", function(error, data) {
    if (error) throw error;

    var data_nest = d3.nest()
            .key(function(d){
                return d.year
            })
            .entries(data);

    data = data_nest.filter(function(d){ return d.key == 2008})[0].values;
    
    var cat = ["Biomass","Coal", "Gas", "Hydro", "Interconnectors", "Nuclear", "Oil", "Solar", "Storage", "Waste", "Wind"];

    x.domain(data.map(function(d) { return d.y; }));
    y.domain([0, 100]).nice();
    z.domain(cat); 

    g.selectAll(".serie")
    .data(stack.keys(cat)(data))
    .enter().append("g")
    .attr("class", "serie")
    .attr("fill", function(d) {return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.y); })
    .attr("y", function(d) { return y(d[0]); })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("height", function(d) { return y(d[1]) - y(d[0]); })
    .attr("width", (x.bandwidth() - 10))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

    function mouseover () {

        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0.8)
        // show tooltip
        div.transition()
        .duration(100)
        .style("opacity", .9);

    }

    function mousemove (d) {

        let color = d3.select(this).style('fill');

        div.html(
            "<div class='tooltip-key' style='background-color: " + color  + ";'></div><p class='inline'>" + labels[color] + "<br>" + ((d[1]) - (d[0])) + "%</p>"
        )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 20) + "px");

    }
    
    function mouseout (d) {
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        // hide tooltip
        div.transition()
        .duration(100)
        .style("opacity", 0);
    }    

    g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform","translate(-8,0)")
    .call(d3.axisLeft(y).ticks(5).tickFormat(function (d) {
        return d3.format("")(d) + "%"
    }))
    .append("text")
    .attr("x", -2)
    .attr("y", y(y.ticks(10).pop()))
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .attr("fill", "#000");

    // add some labels for energy types
    g.selectAll('.chart-label')
    .data(stack.keys(cat)(data))
    .enter()
    .append('g')
    .attr('class', 'chart-label')
    .attr('fill', function(d) { return z(d.key);})
    .selectAll("text")
    .data(function(d) { return d; })
    .enter().append('text')
    .attr("transform", function (d) {
        return "translate(" + (x(d.data.y) + (getWidth() - 6)) + ","+ (y(d[0]) + (y(d[1]) - y(d[0]))/2 + 2) +"),"+ "rotate(35)";
    })
    .text(function () {
        let color = d3.select(this).style('fill');
        // slightly hacky solution
        return labels[color];
    });

});

function updateStackedBar () {

    d3.csv("./data/stacked-bar.csv", function(error, data) {
        if (error) throw error;
    
        var data_nest = d3.nest()
                .key(function(d){
                    return d.year
                })
                .entries(data);
    
        //data = data_nest.filter(function(d){ return d.key == year})[0].values;
        
        var cat = ["Biomass","Coal", "Gas", "Hydro", "Interconnectors", "Nuclear", "Oil", "Solar", "Storage", "Waste", "Wind"];

        x.domain(data.map(function(d) { return d.y; }));
        y.domain([0, 100]).nice();
        z.domain(cat);
        
        g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == year})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500)     
        .attr("height", function(d) { return y(d[1]) - y(d[0]); })
        .attr("x", function(d) { return x(d.data.y); })
        .attr("y", function(d) { return y(d[0]); });

        g.selectAll('.chart-label')
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == year})[0].values))
        .selectAll("text")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .attr("transform", function (d) {
            return "translate(" + (x(d.data.y) + (getWidth() - 6)) + ","+ (y(d[0]) + (y(d[1]) - y(d[0]))/2 + 2) +"),"+ "rotate(35)";
        })
        .style("display", function(d) { 
            if (y(d[1]) - y(d[0]) == 0) {
                return "none";
            } else {
                return "inline";
            }
        });

    });

}
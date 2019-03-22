// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

// nb 2018 = planned in the csv

// width same as line chart, margins and height different


var margin = {top: 5, right: (parseInt(d3.select("#stacked-bar").style("width")) - 35 - 30), bottom: 5, left: 35},
    width = 30,
    height = parseInt(d3.select("#stacked-bar").style("height")) - margin.top - margin.bottom;

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
    .range(["#A7B734", "#ced1cc", "#4e80e5", "#43cfef", '#ff8767', "#dd54b6", "#a45edb", "#cc9b7a", "#ffc83e", "#ea545c", "#00a98e"]);

var stack = d3.stack();

d3.csv("./data/stacked-bar-2.csv", function(error, data) {
    if (error) throw error;

    var data_nest = d3.nest()
            .key(function(d){
                return d.year
            })
            .entries(data);

    data = data_nest.filter(function(d){ return d.key == 2007})[0].values;
    
    var cat = ["Biomass","Coal", "Gas", "Hydro", "Interconnectors", "Nuclear", "Oil", "Other", "Solar", "Waste", "Wind"];

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
    .on("mouseover", function(d) {
        //show circle
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0.9)
        // show tooltip
        div.transition()
        .duration(100)
        .style("opacity", .9);
        div.html( 
            "<span class='label-title'>Year: </span>" + getYear[d.data.year] + 
            "</p><p><span class='label-title'>Share: </span>" + ((d[1]) - (d[0])) + 
            " %</p>"
        )
        .style("left", (d3.event.pageX + 20) + "px")
        .style("top", (d3.event.pageY - 50) + "px");
        })
    .on("mouseout", function(d) {
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        // hide tooltip
        div.transition()
        .duration(200)
        .style("opacity", 0);
    });

    g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform","translate(-10,0)")
    .call(d3.axisLeft(y).ticks(5, "s"))
    .append("text")
    .attr("x", -2)
    .attr("y", y(y.ticks(10).pop()))
    .attr("dy", "0.35em")
    .attr("text-anchor", "start")
    .attr("fill", "#000");

    // g.append("g")
    // .attr("class", "bar-labels")
    // .append("text")
    // .attr("y", -25)
    // .attr("x", 0)
    // .attr("dy", "1em")
    // .attr("fill", "#00a98e")
    // .text("Low carbon %");

    // g.append("g")
    // .attr("class", "bar-labels")
    // .append("text")
    // .attr("y", -25)
    // .attr("x", width)
    // .attr("dy", "1em")
    // .attr("fill", "#ced1cc")
    // .attr("text-anchor", "end")
    // .text("High carbon %");

    // g.append("g")
    // .attr("class", "year-label")
    // .data(data)
    // .append("text")
    // .attr("y", 0)
    // .attr("x", -5)
    // .attr("text-anchor", "end")
    // .attr("dy", "1em")
    // .attr("fill", "#e9e9e9")
    // .text(function (d) {
    //     return d.year;
    // });

    // d3.selectAll(".row")
    // .on("input", highlightYear) // function in barchart.js
    // .on("change", changed); // previously on change..mouseup a bit smoother since transition doesn't happen up slide finished


    function changed() {

        // var value = this.value;

        g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == year})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(50)     
        .attr("height", function(d) { return y(d[1]) - y(d[0]); })
        .attr("x", function(d) { return x(d.data.y); })
        .attr("y", function(d) { return y(d[0]); })

        // update the label

        // var label = g.selectAll(".year-label").selectAll("text");

        // // make sure that add class again or update pattern won't work a second time
        // label.data(data)
        // .text(function (d) {
        //     return getYear[value];  // references array in script.js to change value for planned
        // });

    
    }

    // function initialTransition() {

    //     g.selectAll(".serie")
    //     .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == 2017})[0].values))
    //     .selectAll("rect")
    //     .data(function(d) { return d; })
    //     .transition()
    //     .ease(d3.easeLinear)
    //     .duration(1800) 
    //     .delay(50)     
    //     .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    //     .attr("y", function(d) { return y(d.data.y); })
    //     .attr("x", function(d) { return x(d[0]); })

    //     var label = g.selectAll(".year-label").selectAll("text");

    //     label.data(data)
    //     .text(function (d) {
    //         return "2017";
    //     });

    // }

    // setTimeout(function () {
    //     initialTransition();
    // }, 1500);

});

function updateStackedBar () {

    d3.csv("./data/stacked-bar-2.csv", function(error, data) {
        if (error) throw error;
    
        var data_nest = d3.nest()
                .key(function(d){
                    return d.year
                })
                .entries(data);
    
        //data = data_nest.filter(function(d){ return d.key == year})[0].values;
        
        var cat = ["Biomass","Coal", "Gas", "Hydro", "Interconnectors", "Nuclear", "Oil", "Other", "Solar", "Waste", "Wind"];

        x.domain(data.map(function(d) { return d.y; }));
        y.domain([0, 100]).nice();
        z.domain(cat);
        
        g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == year})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(50)     
        .attr("height", function(d) { return y(d[1]) - y(d[0]); })
        .attr("x", function(d) { return x(d.data.y); })
        .attr("y", function(d) { return y(d[0]); })
    });

}
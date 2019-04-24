var margin3 = {top: 10, right: (parseInt(d3.select("#line-wrapper").style("width"))/ 6.1), bottom: 30, left: 35},
    width3 = parseInt(d3.select("#line-wrapper").style("width")) - margin3.left - margin3.right,
    height3 = responsiveHeight - margin3.top - margin3.bottom;

var parseDate = d3.timeParse("%Y");
var parseDate2 = d3.timeParse("%Y%m%d");

var x3 = d3.scaleTime()
    .range([0, width3]);

var y3 = d3.scaleLinear()
    .range([height3, 0]);

var color = d3.scaleOrdinal()
    // note that the order needs to be the same as the column headers in the CSV or the colours mess up
    .domain(["Coal", "Nuclear", "Gas", "Other", "Hydro", "Biomass",  "Waste", "Wind", "Solar" ])
    .range(["#ced1cc", "#dd54b6", "#4e80e5", "#cc9b7a", "#43cfef", "#A7B734", "#ea545c", "#00a98e", "#ffc83e"]);

var xAxis = d3.axisBottom(x3);

var yAxis = d3.axisLeft(y3);

var line = d3.line()
    .curve(d3.curveLinear) // see http://bl.ocks.org/emmasaunders/c25a147970def2b02d8c7c2719dc7502 for more details
    .x(function(d) { return x3(d.year); })
    .y(function(d) { return y3(d.capacity); });

var svg3 = d3.select("#line-chart").append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

var svg4 = d3.select("#line-chart-background").append("svg")
    .attr("id", "svg-3")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

var div2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// array for background
var allData={"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Biomass":true, "Solar": true,  "Wind":true, "Waste":true };

// powerplants to be shown
var filterData={"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Biomass":true, "Solar": true,  "Wind":true, "Waste":true };

function drawChart(filterData){

    d3.csv("./data/line.csv", function(error, data) {

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var powerplants = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    capacity: +d[name]
                };
            })
            };
        });
    
        // extend x domain of line chart so that bars align

        x3.domain([
            parseDate2(20070701), parseDate2(20180701)
        ]);

        y3.domain([
            d3.min(powerplants, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(powerplants, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })
        ]);

        svg3.selectAll("*").remove();


        // LINK BEHAVIOUR TO DROPDOWN

        d3.select("#selectorType").on("change", selectType)

        function selectType() {
            var type = this.options[this.selectedIndex].value

            reDraw(type);

        }

        // ADD AXES
            
        svg3.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height3 + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        svg3.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // ADD AXIS LABEL

        svg3.append("text")
            .attr("class", "axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .text("Generation (Twh)");

        // ADD LINES
    
        var boo=powerplants.filter(function(d){return filterData[d.name]==true;});
    
        var plant = svg3.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .enter().append("g");

        svg3.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .append("g")
        .attr("class", "plant");
        
        svg3.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .exit()
        .remove();

        plant.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); })
        .style("stroke-dasharray", function (d) {
            // hacky way of getting the planned section of the chart to be dashed without having to filter data or add new lines
            // split into if/else statement because the lines are different lengths

                if (d.name == "Coal") {
                    return 354 + ",4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3"
                } else if (d.name == "Hydro" || d.name == "Other" || d.name == "Solar" || d.name == "Waste") {
                    return 280 + ",4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3"
                } else if (d.name == "Gas") {
                    return 352 + ",4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3"
                } else {
                    return 282 + ",4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3"
                }

        });

        // ADD DOTS WITH TOOLTIP

        // array to ensure that "Planned" shows instead of 2019

        var getYear = {
            2007: "2007",
            2008: "2008",
            2009: "2009",
            2010: "2010",
            2011: "2011",
            2012: "2012",
            2013: "2013",
            2014: "2014",
            2015: "2015",
            2016: "2016",
            2017: "2017",
            2018: "2018",
            2020: "Planned"
        }

        plant.selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", function(d) { return x3(d.year); })
        .attr("cy", function(d) { return y3(d.capacity); })
        // in order to have a the circle to be the same color as the line, you need to access the data of the parentNode
        .attr("fill", function(d){return color(this.parentNode.__data__.name)})
        .attr("opacity", 0)
        .on("mouseover", function(d) {
            //show circle
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.5)
            .attr("r", 5);
            // show tooltip
            div2.transition()
            .duration(100)
            .style("opacity", .9);
            div2.html( "<h3 style= color:" + color(this.parentNode.__data__.name) + 
            ";>" + this.parentNode.__data__.name + 
            "</h3><p><span class='label-title'>Year: </span>" + getYear[yearFormat(d.year)] + 
            "</p><p><span class='label-title'>Capacity: </span>" + decimalFormat(d.capacity) + 
            " <span class='units'>Twh</span></p>")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("r", 4);
            // hide tooltip
            div2.transition()
            .duration(200)
            .style("opacity", 0);
        });

    });


}

// trace lines to appear behind the graph when filtered
function drawBackground () {

    d3.csv("./data/line.csv", function(error, data) {

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var powerplants2 = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    capacity: +d[name]
                };
            })
            };
        });
    
        // extend x domain of line chart so that bars align

        x3.domain([

            parseDate2(20070701), parseDate2(20180701)

        ]);

        y3.domain([

            d3.min(powerplants2, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(powerplants2, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })

        ]);

        svg4.selectAll("*").remove();

        var boo2 =powerplants2.filter(function(d){return allData[d.name]==true;});
    
        var plant2 = svg4.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .enter().append("g");

        svg4.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .append("g")
        .attr("class", "plant-background");
        
        svg4.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .exit()
        .remove();
    
        plant2.append("path")
        .attr("class", "background-line")
        .attr("d", function(d) { return line(d.values); });

    })

}

drawBackground(allData);

drawChart(filterData); // draw initial chart

// LINK CHART TO DROPDOWN

function reDraw(type){
    
    if (type == "All") {
        filterData = {"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Biomass":true, "Wind":true, "Waste":true, "Solar":true};
    } else if (type == "LowCarbon") {
        filterData = {"Wind": true, "Solar": true, "Hydro": true, "Biomass": true, "Waste": true};
    } else if (type == "HighCarbon") {
        filterData = {"Coal":true, "Gas":true, "Oil": true};
    } else if (type == "Biomass") {
        filterData = {"Biomass":true};
    } else if (type == "Coal") {
        filterData = {"Coal":true};
    } else if (type == "Gas") {
        filterData = {"Gas":true};
    } else if (type == "Hydro") {
        filterData = {"Hydro":true};
    } else if (type == "Interconnectors") {
        filterData = {"Interconnectors":true};
    } else if (type == "Nuclear") {
        filterData = {"Nuclear":true};
    } else if (type == "Oil") {
        filterData = {"Other":true};
    } else if (type == "Other") {
        filterData = {"Other":true};
    } else if (type == "Solar") {
        filterData = {"Solar":true};
    } else if (type == "Waste") {
        filterData = {"Waste":true};
    } else if (type == "Wind") {
        filterData = {"Wind":true};
    } else if (type == "Gas") {
        filterData = {"Gas":true};
    }  else {
        // do nothing
        console.log("error");
    }
	drawChart(filterData);
}
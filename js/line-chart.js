var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");
var parseDate2 = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    // note that the order needs to be the same as the column headers in the CSV or the colours mess up
    .domain(["Coal", "Nuclear", "Gas", "Other", "Hydro", "Biomass",  "Waste", "Wind", "Solar" ])
    .range(["#ced1cc", "#dd54b6", "#4e80e5", "#cc9b7a", "#43cfef", "#A7B734", "#ea545c", "#00a98e", "#ffc83e"]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var line = d3.line()
    .curve(d3.curveLinear) // see http://bl.ocks.org/emmasaunders/c25a147970def2b02d8c7c2719dc7502 for more details
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.capacity); });

var svg = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(".1f");

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

        x.domain([

            parseDate2(20060701), parseDate2(20170701)

        ]);

        y.domain([

            d3.min(powerplants, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(powerplants, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })

        ]);

        svg.selectAll("*").remove();



        // LINK BEHAVIOUR TO DROPDOWN

        d3.select("#selectorType").on("change", selectType)

        function selectType() {
            var type = this.options[this.selectedIndex].value

            reDraw(type);

            console.log(type);
        }


        // ADD AXES
            
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // ADD AXIS LABEL

        svg.append("text")
            .attr("class", "axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .text("Capacity (MW)");

        // ADD UNDERLAY TO TRACK MOUSE MOVEMENTS FOR CROSSHAIR

        svg.append('rect')
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)

        // ADD LINES
    
        var boo=powerplants.filter(function(d){return filterData[d.name]==true;});
        console.log("filter");
        console.log(boo);
    
        var plant = svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .enter().append("g");
        
        console.log(plant);

        svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .append("g")
        .attr("class", "plant");
        
        svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .exit()
        .remove();
    
        plant.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); })
        .style("stroke-dasharray", function (d) {
            // quite a hacky way of getting the planned section of the chart to be dashed without having to filter data or add new lines
            // split into if/else statement because the lines are different lengths
            if (d.name == "Coal" || d.name == "Gas") {
                return "425,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3"
            } else if (d.name == "Hydro" || d.name == "Other" || d.name == "Solar" || d.name == "Waste") {
                return "320,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3"
            } else {
                return "325,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3"
            }
        });

        // ADD DOTS WITH TOOLTIP

        // array to ensure that "Planned" shows instead of 2018

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
            2018: "planned"
        }

        plant.selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.capacity); })
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
            div.transition()
            .duration(100)
            .style("opacity", .9);
            div.html( "<h3 style= color:" + color(this.parentNode.__data__.name) + 
            ";>" + this.parentNode.__data__.name + 
            "</h3><p>Year: <b>" + getYear[yearFormat(d.year)] + 
            "</b></p><p> Capacity: <b>" + decimalFormat(d.capacity) + 
            "</b></p>")
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
            div.transition()
            .duration(200)
            .style("opacity", 0);
        });

        // ADD CROSSHAIR

        var focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

        var tooltip = d3.select('#tooltip');

        // append x position tracking line, originally positioned at 0

        focus.append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1' , 0)
        .attr('y2', height);

        function mouseover() {
            focus.style("display", null);
            tooltip.style("display", "block");
        }

        function mouseout() {
            focus.style("display", "none");
            tooltip.style("display", "none");
        }

        var timeScales = data.map(function(d) { return x(d.year); });

        function mousemove(d) {

            // gets line to follow mouse along discreeet data lines, deleted tooltip as this stopped the line appearing for 2017

            var i = d3.bisect(timeScales, d3.mouse(this)[0], 1),
                d0 = data[i-1],
                d1 = data[i];

            focus.attr("transform", "translate(" + x(d0.year) + ",0)"); 

        }

    });


}



console.log(filterData);

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
	console.log("redraw :");
	console.log(filterData);
	drawChart(filterData);
}
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
    .domain(["Coal", "Nuclear", "Gas", "Other", "Hydro", "Bioenergy", "Wind", "Solar"])
    .range(["#ced1cc", "#dd54b6", "#4e80e5", "#cc9b7a", "#43cfef", "#A7B734", "#00a98e", "#ffc83e"]);

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

  
      
var filterData={"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Bioenergy":true, "Wind":true, "Solar":true};//powerplants to be shown

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
  
  //extend x domain of line chart so that bars align

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
   
  var boo=powerplants.filter(function(d){return filterData[d.name]==true;});
  console.log("filter");
  console.log(boo);
  
  var plant = svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;})) //.filter(function(d){return filterData[d.name]==true;})
      .enter().append("g");
    //  .attr("class", "plant");
      
     console.log(plant);  
      svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;}))//.filter(function(d){return filterData[d.name]==true;})
      .append("g")
      .attr("class", "plant");
      
      svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
      .exit()
      .remove();
  
  plant.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

    // ADD LINE LABELS

  plant.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.capacity) + ")"; })
      .attr("x", 20)
      .attr("dy", ".35em")
      .attr("class", "plant label")
      .text(function(d) { return d.name; })
      .style("fill", function(d) { return color(d.name); });

    svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
      .exit()
      .remove();

    // MOUSE EFFECTS 2

    var focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none');

    var tooltip = d3.select('#tooltip');

    // append x position tracking line, originally positioned at 0

    focus.append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('y1' , 0)
    .attr('y2', height);

    // create and overlay to track mouse movements

    svg.append('rect')
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);

    

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
            d0 = data[i-1]
            d1 = data[i];

        focus.attr("transform", "translate(" + x(d0.year) + ",0)"); 

        yearFormat = d3.timeFormat("%Y");

        // var x0 = x.invert(d3.mouse(this)[0]),
        //     //i = bisectDate(data, x0, 1),
        //     d0 = data[i-1],
        //     d1 = data[i],
        //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        //var d2 = data[i+1];

        tooltip.style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px")
        .html("<p>" + yearFormat(d0.year) + "</p>");

    }

});


}



console.log(filterData);

drawChart(filterData); // draw initial chart

// LINK CHART TO DROPDOWN

function reDraw(type){
    
    if (type == "All") {
        filterData = {"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Bioenergy":true, "Wind":true, "Solar":true};
    } else if (type == "LowCarbon") {
        filterData = {"Wind":true};
    } else if (type == "HighCarbon") {
        filterData = {"Coal":true};
    } else if (type == "Biomass") {
        filterData = {"Bioenergy":true};
    } else if (type == "Coal") {
        filterData = {"Coal":true};
    } else if (type == "Gas") {
        filterData = {"Gas":true};
    } else if (type == "Geothermal") {
        filterData = {"Other":true};
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
    } else if (type == "Storage") {
        filterData = {"Other":true};
    } else if (type == "Waste") {
        filterData = {"Bioenergy":true};
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
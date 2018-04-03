var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.capacity); });

var svg = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
      
var filterData={"Coal":true,"Nuclear":true,"Gas":true, "Other": true, "Hydro":true, "Bioenergy":true, "Wind":true, "Solar":true};//powerplants to be shown

function drawChart(filterData){
d3.csv("./data/dummy.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

  data.forEach(function(d) {
    d.year = parseDate(d.year);
  });

  var powerplants = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, capacity: +d[name]};
      })
    };
  });
  
  x.domain(d3.extent(data, function(d) { return d.year; }));

  y.domain([
    d3.min(powerplants, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
    d3.max(powerplants, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })
  ]);
  svg.selectAll("*").remove();

  //LEGEND
  var legend = svg.selectAll('g')
      .data(powerplants)
      .enter()
    .append('g')
      .attr('class', 'legend');
    
  legend.append('rect')
      .attr('x', width - 20)
      .attr('y', function(d, i){ return i *  20;})
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) { 
        return color(d.name);
      });
      
      
  legend.append('text')
      .attr('x', width - 8)
      .attr('y', function(d, i){ return (i *  20) + 9;})
      .text(function(d){ return d.name; });

    // link behaviour to dropdown

    d3.select("#selectorType").on("change", selectType)

    function selectType() {
        var type = this.options[this.selectedIndex].value

        reDraw2(type);

        console.log(type);
    }

  legend
  		.on("click",function(d){
  				//filter data		
  				//filterData[d.name]=!filterData[d.name];
  				reDraw(d.name);
    });
 
    	
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("capacity (ºF)");
   
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

  plant.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.capacity) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
    svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
      .exit()
      .remove();
});
}

console.log(filterData);

drawChart(filterData); // draw initial chart

function reDraw(name){
	
	filterData[name]=!filterData[name]; //this removes the one selected
	console.log("redraw :");
	console.log(filterData);
	drawChart(filterData);
}

function reDraw2(type){
	
    //filterData[type]==filterData[type];
    
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
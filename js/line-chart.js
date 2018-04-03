var margin = {top: 20, right: 40, bottom: 30, left: 50},
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
    .range(["#333333", "#A14A7B", "#216184", "#7c5641", "#2cb0c1", "#d67b36", "#136400", "#EFC530"]);

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
        return {year: d.year, capacity: +d[name]};
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



    // link behaviour to dropdown

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

    // ADD LINE LABELS

  plant.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.capacity) + ")"; })
      .attr("x", 20)
      .attr("dy", ".35em")
      .attr("class", "plant-label")
      .text(function(d) { return d.name; })
      .style("fill", function(d) { return color(d.name); });

    svg.selectAll(".plant")
      .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
      .exit()
      .remove();

    // MOUSE EFFECTS

    var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "gray")
    .style("stroke-width", "1px")
    .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(powerplants)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
        .attr("r", 5)
        .style("stroke", function(d) {
        return color(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas

    var mouse = d3.mouse(this);

    d3.select(".mouse-line")
        .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
        });

    d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
        //console.log(width/mouse[0])
        var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.year; }).right;
            idx = bisect(d.values, xDate);
        
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
        }
        
        d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(0));
            
        return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });

});


}



console.log(filterData);

drawChart(filterData); // draw initial chart

function reDraw(type){
	
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
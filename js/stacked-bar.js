// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

// nb 2018 = planned in the csv

// width same as line chart, margins and height different

var margin2 = {top: 50, right: 25, bottom: 30, left: 40},
    width = 450 - margin2.left - margin2.right,
    height2 = 105 - margin2.top - margin2.bottom;

var svg3 = d3.select('#stacked-bar').append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);

g = svg3.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// have to create different names as using other similar variables in the same document

var y3 = d3.scaleBand()			
    .rangeRound([0, height2])	
    .paddingInner(0.05)
    .align(0.1);

var x3 = d3.scaleLinear()		
    .rangeRound([0, width]);	

var z3 = d3.scaleOrdinal()
    .range(["#00a98e", "#ced1cc"]);

var stack = d3.stack();

d3.csv("./data/stacked-bar.csv", function(error, data) {
  if (error) throw error;

  var data_nest = d3.nest()
        .key(function(d){
            return d.year
        })
        .entries(data);

    console.log(data_nest);

  data = data_nest.filter(function(d){ return d.key == 2017})[0].values;

  console.log(data);
  
  var cat = ["lowCarbon","highCarbon"];

  y3.domain(data.map(function(d) { return d.y; }));
  x3.domain([0, 100]).nice();
  z3.domain(cat); 

  g.selectAll(".serie")
    .data(stack.keys(cat)(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) {return z3(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y3(d.data.y); })
      .attr("x", function(d) { return x3(d[0]); })
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", function(d) { return x3(d[1]) - x3(d[0]); })
      .attr("height", (y3.bandwidth() - 10));

//   g.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height2/2 + ")")
//       .style("font", "18px sans-serif")
//       .call(d3.axisLeft(y3));

  g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform","translate(0," + height2 + ")")
      .call(d3.axisBottom(x3).ticks(5, "s"))
    .append("text")
      .attr("y", 2)
      .attr("x", x3(x3.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000");

    g.append("g")
    .attr("class", "bar-labels")
    .append("text")
    .attr("y", -25)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("fill", "#00a98e")
    .text("Low carbon");

    g.append("g")
    .attr("class", "bar-labels")
    .append("text")
    .attr("y", -25)
    .attr("x", width - 70)
    .attr("dy", "1em")
    .attr("fill", "#ced1cc")
    .text("High carbon");

    g.append("g")
    .attr("class", "year-label")
    .data(data)
    .append("text")
    .attr("y", 10)
    .attr("x", -40)
    .attr("dy", "1em")
    .attr("fill", "#e9e9e9")
    .text(function (d) {
        return d.year;
    });

  d3.select("input")
    //.on("input", changed)
    .on("mouseup", changed); // previously on change..mouseup a bit smoother since transition doesn't happen up slide finished

  function changed() {

    var value = this.value;

    g.selectAll(".serie")
      .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
      .selectAll("rect")
      .data(function(d) { return d; })
      .transition()
      .duration(500) 
      .delay(200)     
      .attr("width", function(d) { return x3(d[1]) - x3(d[0]); })
      .attr("y", function(d) { return y3(d.data.y); })
      .attr("x", function(d) { return x3(d[0]); })

    // update the label

    var label = g.selectAll(".year-label").selectAll("text");

    //label.remove();

    // make sure that add class again or update pattern won't work a second time
    label.data(data)
    .text(function (d) {
        return getYear[value];  // references array in script.js to change value for planned
    });

    
}

});
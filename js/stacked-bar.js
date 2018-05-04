// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

var margin = {top: 20, right: 70, bottom: 30, left: 40},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg3 = d3.select('#stacked-bar').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

g = svg3.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// have to create different names as using other similar variables in the same document

var y3 = d3.scaleBand()			
    .rangeRound([0, height])	
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
      .attr("width", function(d) { return x3(d[1]) - x3(d[0]); })
      .attr("height", y3.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height/2 + ")")
      .style("font", "18px sans-serif")
      .call(d3.axisLeft(y3));

  g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform","translate(0," + height + ")")
      .call(d3.axisBottom(x3).ticks(5, "s"))
    .append("text")
      .attr("y", 2)
      .attr("x", x3(x3.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000");

  d3.select("input")
    .on("input", changed)
    .on("change", changed);

  function changed() {
    var value = this.value;

    g.selectAll(".serie")
      .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
      .selectAll("rect")
      .data(function(d) { return d; })
      .transition()
      .duration(500) 
      .delay(function(d,i){return i*100})     
      .attr("width", function(d) { return x3(d[0]) - x3(d[1]); })
      .attr("y", function(d) { return y3(d.data.y); })
      .attr("x", function(d) { return x3(d[1]); })
}

});
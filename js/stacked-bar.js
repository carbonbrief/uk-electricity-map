// with help from https://bl.ocks.org/Andrew-Reid/0aedd5f3fb8b099e3e10690bd38bd458

var margin = {top: 20, right: 70, bottom: 30, left: 40},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg3 = d3.select('#stacked-bar').append("svg"),
    g = svg3.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y3 = d3.scaleBand()			
    .rangeRound([0, height])	
    .paddingInner(0.05)
    .align(0.1);

var x3 = d3.scaleLinear()		
    .rangeRound([0, width]);	

var z3 = d3.scaleOrdinal()
    .range(["#ced1cc", "#00a98e"]);

// year to be shown
var getYear = 2017;

d3.csv("./data/stacked-bar.csv", function(d, i, columns) {

    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;

    filteredData = data.filter(function(row) {
        return row['year'] == getYear
    })
    
  }, function(error, data) {
    if (error) throw error;
  
    var keys = data.columns.slice(1);
  
    data.sort(function(a, b) { return b.total - a.total; });
    y3.domain(data.map(function(d) { return d.year; }));					// x.domain...
    x3.domain([0, d3.max(data, function(d) { return d.total; })]).nice();	// y.domain...
    z3.domain(keys);
  
    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z3(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) { return y3(d.data.year); })	    //.attr("x", function(d) { return x(d.data.year); })
        .attr("x", function(d) { return x3(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
        .attr("width", function(d) { return x3(d[1]) - x3(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y3.bandwidth());						    //.attr("width", x.bandwidth());	
  
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(y3));									//   .call(d3.axisBottom(x));
  
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+height+")")				// New line
        .call(d3.axisBottom(x3).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", x3(x3.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population")
        .attr("transform", "translate("+ (-width) +",-10)");   	// Newline
  
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
       .attr("transform", function(d, i) { return "translate(-50," + (300 + i * 20) + ")"; });
  
    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z3);
  
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
// with help from https://bl.ocks.org/reinson/166bae46dd106b45cf2d77c7802768ca

// nb 2018 = planned in the csv

// width same as line chart, margins and height different

function getHeight2 () {
    if (screenWidth > 1050) {
        return 90
    } else if (screenWidth < 1051) {
        return 85
    } 
}
console.log(screenWidth);

var responsiveHeight2 = getHeight2();

var margin2 = {top: 35, right: 25, bottom: 30, left: 45},
    width = parseInt(d3.select("#stacked-bar").style("width")) - margin2.left - margin2.right,
    height2 = responsiveHeight2 - margin2.top - margin2.bottom;

var svg4 = d3.select('#stacked-bar').append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom);

g = svg4.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// have to create different names as using other similar variables in the same document

var y4 = d3.scaleBand()			
    .rangeRound([0, height2])	
    .paddingInner(0.05)
    .align(0.1);

var x4 = d3.scaleLinear()		
    .rangeRound([0, width]);	

var z4 = d3.scaleOrdinal()
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

  data = data_nest.filter(function(d){ return d.key == 2007})[0].values;

  console.log(data);
  
  var cat = ["lowCarbon","highCarbon"];

  y4.domain(data.map(function(d) { return d.y; }));
  x4.domain([0, 100]).nice();
  z4.domain(cat); 

  g.selectAll(".serie")
    .data(stack.keys(cat)(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) {return z4(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y4(d.data.y); })
      .attr("x", function(d) { return x4(d[0]); })
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("width", function(d) { return x4(d[1]) - x4(d[0]); })
      .attr("height", (y4.bandwidth() - 10))
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
      .attr("transform","translate(0," + height2 + ")")
      .call(d3.axisBottom(x4).ticks(5, "s"))
    .append("text")
      .attr("y", 2)
      .attr("x", x4(x4.ticks(10).pop()))
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
    .text("Low carbon %");

    g.append("g")
    .attr("class", "bar-labels")
    .append("text")
    .attr("y", -25)
    .attr("x", width)
    .attr("dy", "1em")
    .attr("fill", "#ced1cc")
    .attr("text-anchor", "end")
    .text("High carbon %");

    g.append("g")
    .attr("class", "year-label")
    .data(data)
    .append("text")
    .attr("y", 0)
    .attr("x", -5)
    .attr("text-anchor", "end")
    .attr("dy", "1em")
    .attr("fill", "#e9e9e9")
    .text(function (d) {
        return d.year;
    });

  d3.selectAll(".row")
    .on("input", highlightYear) // function in barchart.js
    .on("change", changed); // previously on change..mouseup a bit smoother since transition doesn't happen up slide finished

  
    function changed() {

        var value = this.value;

        g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(50)     
        .attr("width", function(d) { return x4(d[1]) - x4(d[0]); })
        .attr("y", function(d) { return y4(d.data.y); })
        .attr("x", function(d) { return x4(d[0]); })

        // update the label

        var label = g.selectAll(".year-label").selectAll("text");

        // make sure that add class again or update pattern won't work a second time
        label.data(data)
        .text(function (d) {
            return getYear[value];  // references array in script.js to change value for planned
        });

    
    }

    function initialTransition() {

        g.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == 2017})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .ease(d3.easeLinear)
        .duration(1800) 
        .delay(50)     
        .attr("width", function(d) { return x4(d[1]) - x4(d[0]); })
        .attr("y", function(d) { return y4(d.data.y); })
        .attr("x", function(d) { return x4(d[0]); })

        var label = g.selectAll(".year-label").selectAll("text");

        label.data(data)
        .text(function (d) {
            return "2017";
        });

    }

    setTimeout(function () {
        initialTransition();
    }, 1500);

});
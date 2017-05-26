// Dataprocessing week 6
// Design for a linked view d3 map
// Adriaan de Klerk - 10323929

// set dimensions for scatterplot
var margin = {top: 30, right: 30, bottom: 40, left: 50},
    width = 500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set x value and axis
var xValue = function(d) { return d["earnings"]},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// set y value and axis
var yValue = function(d) { return d["rate"];},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var cValue = function(d) { return d.rate;},
color = d3.scale.category10();

// load data files for US map and data
queue()
  .defer(d3.json, "us.json")
  .defer(d3.csv, "data2.csv")
  .await(loading);

// function for checking the files and converting data
function loading(error, us, data) {
  if (error && error.target.status === 404) {
      console.log("File not found")
    }
  if(data.length === 0){
  console.log("File empty")
  }
  var combineIdEarnings = {};
  var combineIdName = {};

data.forEach(function(d) {
  combineIdEarnings[d.id] = +d.earnings;
  combineIdName[d.id] = d.name;
  d["rate"] = +d["rate"];
});

var svg2 = d3.select("#chart2").append("svg:svg")
      .attr("width", width)
      .attr("height", height)
.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// create tooltip element
var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

// scale x and y axis with data
xScale.domain([d3.min(data, xValue)-50000, d3.max(data, xValue)+20]);
yScale.domain([d3.min(data, yValue)-400, d3.max(data, yValue)]);

// create x-axis
svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Total earnings 2001");

// create y-axis
svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 8)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Amount of farms")

  // append data to scatterplot
  svg2.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));})

        // add mouse interactivity and tooltip
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(100)
                 .style("opacity", 1);
            tooltip.html(d["name"] + ": <br/> " +
            "Total earnings: $" + xValue(d) + ", Amount of farms: " + yValue(d))
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(100)
                 .style("opacity", 0);
               });
             };

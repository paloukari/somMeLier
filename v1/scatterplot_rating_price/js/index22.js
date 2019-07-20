// Setting the params for margin 
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d.price;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    // xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    xAxis = d3.axisBottom(xScale);

// setup y
var yValue = function(d) { return d.rating;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    // yAxis = d3.svg.axis().scale(yScale).orient("left");
    yAxis = d3.axisLeft(yScale);
    

// add the graph canvas to the body of the webpage
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// load data
d3.csv("data/result.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.price = +d.price;
    d.rating = +d.rating;
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("price");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Rating");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap);


// This function is to make the slider work
function getVals(){
  // Get slider values
  var parent = this.parentNode;
  var slides = parent.getElementsByTagName("input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
  // Neither slider will clip the other, so make sure we determine which is larger
  if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
  
  var displayElement = parent.getElementsByClassName("rangeValues")[0];
      displayElement.innerHTML = slide1 + " - " + slide2;
      // filtering
      data = data.filter(function(d){return d.price > slide1;})
      data = data.filter(function(d){return d.price < slide2;})
}

window.onload = function(){
  // Initialize Sliders
  var sliderSections = document.getElementsByClassName("range-slider");
      for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
          if( sliders[y].type ==="range" ){
            sliders[y].oninput = getVals;
            // Manually trigger event first time to display values
            sliders[y].oninput();
          }
        }
      }
}

// ploting the text that goes with the points
  var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "top")

// This is the rectangle used to recover the mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
    ;

    // setting up a var with the max value of the X axis (already modified to number)
    var max_x = d3.max(data, function(d) { return xScale(d.price);})


// This functions shows what happens when the mouse move
  function mouseover() {
    focusText.style("opacity",1)
  }

  // This functions shows what happens when the mouse move
  function mousemove() {
    // bring the coord 
    var x0 = xScale(d3.mouse(this)[0]);
    var i = d3.bisect(x0);
    selectedData = data[i]
    
    //working on the focus texts
    focusText
      // .html(selectedData.price)
      .html(selectedData.price + "_" + d3.mouse(this)[1] +"_" + x0)
      .attr("x", d3.mouse(this)[0])
      .attr("y", d3.mouse(this)[1]+100)
      .style("opacity",1)
    }

// This functions shows what happens when the mouse leave the graph
  function mouseout() {
    focusText.style("opacity", 0)
  }


});


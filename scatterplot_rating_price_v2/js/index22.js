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


//Creating the box to add the  informations on price and rating
var div = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Creating the box to add the  informations on price and rating
var box = d3.select("#chart").append("box")
    // .attr("class", "tooltip")
    .style("opacity", 0);

var min_price = 100
var max_price = 100000
var ratings = 0

function draw(min_price,max_price,ratings){
// load data
d3.csv("data/result.csv", function(error, data) {


  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.price = +d.price;
    d.rating = +d.rating;
    d.name = d.name;
    d.region = d.region;
    d.grapes = d.grapes;
    d.food = d.food;
    d.winery = d.winery;
    d.url = d.url;
//    console.log(d);
  });


  data = data.filter(function(d){return d.price > min_price;})
  data = data.filter(function(d){return d.price < max_price;})
  data = data.filter(function(d){return d.rating > ratings;})
  // console.log(ratings)
  // console.log(min_price)
  // if(ratings>0){
  //   data = data.filter(function(d){return d.rating > ratings;})
  //   // console.log(d)
  //   }
    



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
      .attr("cy", yMap)
      .on("mouseover", function(d) {
               div.transition()
                 .duration(200)
                 .style("opacity", .9);
               div.html(d.price+" USD" + "<br>" + d.rating + " Stars"
                        +"<br>" + d.name)
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
               box.transition()
                 .duration(200)
                 .style("opacity", .9);
               box.html("<br>"+d.price+" USD" + "<br>" + 
                        d.rating + " Stars" +"<br>" +
                        d.name +"<br>" +
                        d.winery +"<br>"+
                        d.region +"<br>" +
                        d.grapes +"<br>" +
                        d.food
                        )
                 .style("left", 1000 + "px")
                 .style("top", 0 + "px");

                                     }
          )
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       box.transition()
         .duration(500)
         .style("opacity", 0);
       })
     .on("click",function(d){
          window.open(d.url, '_blank')});

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
      displayElement.innerHTML = slide1 + " - " + slide2
      svg.selectAll("*").remove()
      svg.selectAll("*").transition().duration(3000)
      draw(slide1,slide2,ratings);
      // filtering
      // data = data.filter(function(d){return d.price > slide1;})
      // data = data.filter(function(d){return d.price < slide2;})
      max_price = slide2
      min_price = slide1

  
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

//function to get the changes in the rating filter
const buttons = d3.selectAll('#rating');
buttons.on('change', function(d) {
ratings = this.value/10
svg.selectAll("*").remove()
svg.selectAll("*").transition().duration(3000)
draw(min_price,max_price,ratings)
console.log(ratings)
});

});
}

draw(0,10000,0)
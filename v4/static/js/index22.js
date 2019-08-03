// Setting the params for margin 
var margin = {top: 20, right: 20, bottom: 60, left: 60},
    width = 550 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

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
    yAxis = d3.axisLeft(yScale);
    

// add the graph canvas to the body of the webpage
var svg = d3.select("div#price").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Creating the box to add the  informations on price and rating
var div = d3.select("div#price").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Creating the box to add the  informations on price and rating
var box = d3.select("div#price").append("box")
    // .attr("class", "tooltip")
    .style("opacity", 0);

var min_price = 100
var max_price = 100000
var ratings = 0
var selectedCountries = null
var selectedGrapes = null

function draw(min_price,max_price,ratings,selectedCountries,selectedGrapes){
// load data
d3.csv("static/data/result.csv", function(error, data) {


  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.price = +d.price;
    d.rating = +d.rating;
    d.name = d.name;
    d.region = d.region;
    d.country = d.country;
    d.grapes = d.grapes;
    d.food = d.food;
    d.winery = d.winery;
    d.url = d.url;
    d.types = d.types;
//    console.log(d);
  });

  // filtering price
  data = data.filter(function(d){return d.price > min_price;})
  data = data.filter(function(d){return d.price < max_price;})

  // filtering rating
  data = data.filter(function(d){return d.rating >= ratings;})

  // filtering country
  data = data.filter(function (e) {
          if (selectedCountries != null && selectedCountries.length > 0) {
              if (!selectedCountries.includes(e.country))
                  return false;
          }
          return true;
      });

  //filtering grapes    
  data = data.filter(function (e) {
          if (selectedGrapes != null && selectedGrapes.length > 0) {
              if (!selectedGrapes.includes(e.grapes))
                  return false;
          }
          return true;
      });


  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    
  svg.append("text")
      .attr("font-size", "18px")
      .attr("transform", "translate(0," + height + ")")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Price");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("text")
      .attr("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ratings");

  //add legends
  svg.append("text")
      .attr("font-size", "15px")
      .attr("transform", "translate(0," + height + ")")
      .attr("y", 40)
      .attr("x", 10)
      .style("text-anchor", "start")
      .style("fill", '#B0C4DE')
      .text("White Wine");

  svg.append("text")
      .attr("font-size", "15px")
      .attr("transform", "translate(0," + height + ")")
      .attr("y", 60)
      .attr("x", 10)
      .style("text-anchor", "start")
      .style("fill", '#B22222')
      .text("Red Wine");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2.5)
      .style("fill", function(d) {
                                    if(d.types == 'White wine')
                                      {
                                        return '#B0C4DE' 
                                      }
                                    else
                                      {
                                        return '#B22222'  
                                      }
                                  } )
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
                        d.types+"<br>"+
                        d.winery +"<br>"+
                        d.region +"<br>" +
                        d.grapes +"<br>" +
                        d.food
                        )
                 .style("left", 1000 + "px")
                 .style("top", 0 + "px")
                 .style("font-size", 13);
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
      draw(slide1,slide2,ratings,selectedCountries,selectedGrapes);
      
      max_price = slide2
      min_price = slide1
      console.log(max_price)

  
}

const sliders2 = d3.selectAll('#slidess');
sliders2.on('change', function(d) 
{
  var sliderSections = document.getElementsByClassName("range-slider");
        for( var x = 0; x < sliderSections.length; x++ )
          {
            var sliders = sliderSections[x].getElementsByTagName("input");
            for( var y = 0; y < sliders.length; y++ )
              {
                if( sliders[y].type ==="range" )
                  {
                    sliders[y].oninput = getVals;
                    // Manually trigger event first time to display values
                    sliders[y].oninput();
                  }
              }
          }
  console.log(sliderSections)
});

//function to get the changes in the rating filter
const buttons = d3.selectAll('#rating');
buttons.on('change', function(d) {
ratings = this.value/10
svg.selectAll("*").remove()
svg.selectAll("*").transition().duration(3000)
draw(min_price,max_price,ratings,selectedCountries,selectedGrapes)
console.log(ratings)
});

//function to get the changes in the country and grapes filter
$(".chosen-select").chosen({}).change(function (e, c) {
        // filtering country
        selectedCountries = Array.from(document.getElementById("country").selectedOptions).map(function (e) {
            return e.value;
        });
        svg.selectAll("*").remove()
        svg.selectAll("*").transition().duration(3000)
        draw(min_price,max_price,ratings,selectedCountries,selectedGrapes)
        
        // filtering grapes
        selectedGrapes = Array.from(document.getElementById("grape").selectedOptions).map(function (e) {
            return e.value;
        });
        svg.selectAll("*").remove()
        svg.selectAll("*").transition().duration(3000)
        draw(min_price,max_price,ratings,selectedCountries,selectedGrapes)

    });




});
}

draw(0,10000,0)
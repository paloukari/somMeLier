var width = 500,
    height = 500;


var chart = d3.select("div#chart")
  .append("svg")
  .attrs({
          "height": height,
          "width": width
         })
  .append("g")
  .attr("transform", "translate("+ 0 + "," + height/2 +")")

var radiusScale = d3.scaleSqrt().domain([0,1100]).range([3,50])

var simulation = d3.forceSimulation()
  .force("x", d3.forceX(width/2).strength(.02))
  .force("y", d3.forceX(height/2).strength(.02))
  .force("collide", d3.forceCollide(function(d){
              return radiusScale(d["Count"]) + 1
            })
        );

reds=d3.scaleLinear().domain([0,131]).range(["#BD1E1E","#940940"])
whites=d3.scaleLinear().domain([132,228]).range(["#E9EB8A","#79CF4E"])


d3.queue()
  .defer(d3.csv, "getData")
  .await(ready)

function ready(error, datapoints){
  console.log(datapoints)
  var circs = chart.selectAll(".artist")
    .data(datapoints)
    .enter()
    .append("circle")
    .attrs({"class": "artistic",
            "r": function(d){
              return radiusScale(d["Count"])
            },
            "fill": function(d){if(d["Type"]==='Red wine'){
              return reds(d.id);
            }
            else{
              return whites(d.id);
            }}
           })
    .on("mouseover", function(d,i){
      hoverText.text(d.Grape+": "+d.Count);
      hoverGroup.attr("x",d.x);
      hoverGroup.attr("y",d.y);
      hoverGroup.style("visibility","visible");
    })
    .on("mouseout", function(d,i){
      hoverGroup.style("visibility","hidden");
    })

var hoverGroup=chart.append("g").style("visibility","hidden");

hoverGroup.append("rect")
          .attr("id","id")
          .attr("x",0)
          .attr("y",0)
          .attr("width",200)
          .attr("height",40)
          .attr("fill","rgb(255, 255, 255)")
          .attr("stroke-width","1px")
          .attr("stroke","white");

var hoverText = hoverGroup.append("text").attr("x",7).attr("y",15).style("font-size","16px");
   simulation.nodes(datapoints)
    .on("tick", ticked)

  function ticked(){
    circs
      .attrs({ "cx": function(d){ return d.x },
               "cy": function(d){ return d.y }
    })
  }
}

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
      
      max_price = slide2
      min_price = slide1
      console.log(min_price)
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
console.log(ratings)
});

//function to get the changes in the country and grapes filter
$(".chosen-select").chosen({}).change(function (e, c) {
      // filtering country
      selectedCountries = Array.from(document.getElementById("country").selectedOptions).map(function (e) {
          return e.value;
      });
      console.log(selectedCountries)
      
      // filtering grapes
      selectedGrapes = Array.from(document.getElementById("grape").selectedOptions).map(function (e) {
          return e.value;
      });
      console.log(selectedGrapes)

  });
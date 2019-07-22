var width = 500, 
    height = 500;


var chart = d3.select("#chart")
  .append("svg")
  .attrs({
          "height": height,
          "width": width
         })
  .append("g")
  .attr("transform", "translate("+ 0 + "," + height/2 +")")

var radiusScale = d3.scaleSqrt().domain([0,34000]).range([3,25])

var simulation = d3.forceSimulation()
  .force("x", d3.forceX(width/2).strength(.02))
  .force("y", d3.forceX(height/2).strength(.02))
  .force("collide", d3.forceCollide(function(d){
              return radiusScale(d["Sales (Real)"]) + 1
            })
        );

d3.queue()
  .defer(d3.csv, "https://raw.githubusercontent.com/rufuspollock/music-sales/master/data/data.csv")
  .await(ready)

function ready(error, datapoints){
  
  var circs = chart.selectAll(".artist")
    .data(datapoints)
    .enter()
    .append("circle")
    .attrs({"class": "artistic",
            "r": function(d){
              return radiusScale(d["Sales (Real)"])
            },
            "fill": "steelblue"
           })
    
   simulation.nodes(datapoints)
    .on("tick", ticked)
  
  function ticked(){
    circs
      .attrs({ "cx": function(d){ return d.x },
               "cy": function(d){ return d.y }
    })
  }
}

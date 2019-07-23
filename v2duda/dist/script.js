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
              return radiusScale(d["count"]) + 1
            })
        );

d3.queue()
  .defer(d3.csv, "data/database.csv", function(d){
      var grapes = {
        grape: d.grapes.split(",").flat(),
        type: d.types,
        count: 1
      }
      return grapes;
    })
  .await(ready)


// var grapes;
//
// d3.csv("example.csv", function(d) {
//   return {
//     year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
//     make: d.Make,
//     model: d.Model,
//     length: +d.Length // convert "Length" column to number
//   };
// }, function(error, rows) {
//   console.log(rows);
// });

d3.csv("data/database.csv", function(d){
    var grape_types= {
      grape: d.grapes.split(",").flat(),
      type: d.types,
      count: 1
    };
    return grape_types;
  }, function(error, rows) {
      console.log(rows);
    });


// var countedGrapes = grapes.reduce(function (allGrapes, grape) {
//   if (grape in allGrapes) {
//     allGrapes[grape]++;
//   }
//   else {
//     allGrapes[grape] = 1;
//   }
//   return allGrapes;
//   console.log(allGrapes)
// }, {});

function ready(error, datapoints){
  var circs = chart.selectAll(".artist")
    .data(datapoints)
    .enter()
    .append("circle")
    .attrs({"class": "artistic",
            "r": function(d){
              return radiusScale(d["count"])
            },
            "fill": "purple"
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

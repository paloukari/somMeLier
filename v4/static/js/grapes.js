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

reds=d3.scaleLinear().domain([0,132]).range(["#801B4D","#CC2016"])
whites=d3.scaleLinear().domain([132,229]).range(["#43C6AC","#F8FFAE"])

d3.queue()
  .defer(d3.csv, "static/data/grapes_db.csv")
  .await(ready)

function ready(error, datapoints){
  //console.log(datapoints)
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
      hoverGroup.attr("x",i);
      hoverGroup.attr("y",i);
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

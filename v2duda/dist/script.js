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

var radiusScale = d3.scaleSqrt().domain([0,1250]).range([3,40])

var simulation = d3.forceSimulation()
  .force("x", d3.forceX(width/2).strength(.02))
  .force("y", d3.forceX(height/2).strength(.02))
  .force("collide", d3.forceCollide(function(d){
              return radiusScale(d["Count"]) + 1
            })
        );

reds=d3.scaleLinear().domain([0,189]).range(["#801B4D","#CC2016"])
whites=d3.scaleLinear().domain([190,322]).range(["#43C6AC","#F8FFAE"])

d3.queue()
  .defer(d3.csv, "data/grapes_db.csv")
  .await(ready)

function ready(error, datapoints){
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

   simulation.nodes(datapoints)
    .on("tick", ticked)
    .on("mouseover",function(d, i) {
      hoverText.text(d.Grape,": ",d.Count);
      hoverGroup.style("visibility","visible")
})

  function ticked(){
    circs
      .attrs({ "cx": function(d){ return d.x },
               "cy": function(d){ return d.y }
    })
  }
}

//setting the houver group
var hoverGroup = chart.append("g").style("visibility","hidden");

     hoverGroup.append("rect")
     .attr("id","steps")
     .attr("x",0)
     .attr("y",0)
     .attr("width",50)
     .attr("height",20)
     .attr("fill","rgb(255, 122, 182)")
     .attr("stroke-width","1px")
     .attr("stroke","gray");

//setting the hover text
var hoverText = hoverGroup.append("text").attr("x",7).attr("y",15);

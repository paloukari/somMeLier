// set the dimensions and margins of the graph

var width = 500,
    height = 500;

// append the chart object to the body of the pag

var chart = d3.select("div#chart")
  .append("svg")
  .attrs({
          "height": height,
          "width": width
         })
  .append("g")
  .attr("transform", "translate("+ 0 + "," + height/2 +")")

// reading data

d3.csv("getData", function(error,data) {

	console.log(data)
	//setting the colors

	var reds=d3.scaleLinear().domain([0,132]).range(["#801B4D","#CC2016"]);
	var whites=d3.scaleLinear().domain([132,229]).range(["#43C6AC","#F8FFAE"]);

	// setting the scale for the "grapes"

	var radiusScale = d3.scaleSqrt().domain([0,1100]).range([3,50])

	// creating the tooltip

	var Tooltip = d3.select("div#chart")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip")
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "2px")
	.style("border-radius", "5px")
	.style("padding", "5px")

  // functions that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.Grape + '</u>' + "<br>" + d.Count + " wines")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the "grapes"
  var circle = chart.selectAll(".artist")
    .data(data)
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
    .on("mouseover", mouseover) // What to do when hovered
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  var simulation = d3.forceSimulation()
  .force("x", d3.forceX(width/2).strength(.02))
  .force("y", d3.forceX(height/2).strength(.02))
  .force("collide", d3.forceCollide(function(d){
              return radiusScale(d["Count"]) + 1
            })
        );

  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
      });
});
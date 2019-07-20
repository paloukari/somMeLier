var grapes_viz_lib = grapes_viz_lib || {};

grapes_viz_lib.choropleth = function() {
  var width = 700;
  var height = 350;
  var data = d3.map();
  var graph_data = [];

  var svg = d3
    .select("div#grapes")
    .append("svg")
    .attr("width", width)
    .attr("height", height);;

  var svg2 = d3
    .select("div#grapes")
    .append("svg")
    .attr("width", 380)
    .attr("height", 350);

  var add_graph = function(country_name) {
    var rel_data = [];
    for (var i = 0; i < graph_data.length; i++) {
      if (graph_data[i].country === country_name) {
          rel_data.push(graph_data[i]);
      }
    }

    d3.select("#curr_graph").remove();
    var svg = d3
      .select("div#grapes")
      .append("svg")
      .attr("id", "curr_graph")
      .attr("width", 500)
      .attr("height", 320);

    var width = 230;
    var height = 230;
    var padding = 40;

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", padding)
      .attr("y", padding);

  };
  //
  var add_highlight = function(d) {
    svg2
      .append("text")
      .attr("id", "curr_country_name")
      .attr("x", 0)
      .attr("y", 200)
      .style("font-size", 18)
      .style("font-weight", "bold")
      .text(function() {
        return d.properties.name;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_grape")
      .attr("x", 0)
      .attr("y", 220)
      .style("font-size", 14)
      .text(function() {if (d.obj.grape != "_"){
        return "Most Common Grape: " + d.obj.grape}
        else{
          return ""
        };
      });
    // svg2
    //   .append("text")
    //   .attr("id", "curr_country_action")
    //   .attr("x", 0)
    //   .attr("y", 300)
    //   .style("font-size", 14)
    //   .style("font-style", "italic")
    //   .text(function() {if (d.obj.grape != "_"){
    //     return "Click to learn more."}
    //     else{
    //       return ""
    //     };
    //   });
  };

  var add_choropleth = function() {
    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(100)
      .center([0,20])
      .translate([width / 2, height / 2]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, 'data/all_grapes.csv', function(d) {
        if (d.country != "" && d.rating != ""){
          if (d.country === "United States") {
            d.country = "USA"
          }
          var curr = data.get(d.country) || {"nr": 0, "grape": "_"};
          if (+d.nr > +curr.nr) {
            data.set(d.country, {"nr": +d.nr, "grape": d.grape});
          }
          graph_data.push(d);
        }
      })
      .await(ready);

    function ready(error, topo) {
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath().projection(projection))
        // set the color of each country
        .attr("fill", function (d) {
          d.obj = data.get(d.properties.name) || {"rating": 0, "grape": "_"};
          if (d.obj.grape === "Merlot") {
            return "#8c032c";
          }
          else if (d.obj.grape === "Shiraz/Syrah") {
            return "#87133c";
          }
          else if (d.obj.grape === "Merlot") {
            return "#8c032c";
          }
          else if (d.obj.grape === "Malbec") {
            return "#692541";
          }
          else if (d.obj.grape === "Cabernet Sauvignon") {
            return "#871318";
          }
          else if (d.obj.grape === "Müller-Thurgau") {
            return "#c2c08f";
          }
          else if (d.obj.grape === "Assyrtiko") {
            return "#f3f5d0";
          }
          else if (d.obj.grape === "Furmint") {
            return "#dbb363";
          }
          else if (d.obj.grape === "Sangiovese") {
            return "#7a211b";
          }
          else if (d.obj.grape === "Sauvignon Blanc") {
            return "#f2de6d";
          }
          else if (d.obj.grape === "Touriga Nacional") {
            return "#450f2f";
          }
          else if (d.obj.grape === "Vitovska") {
            return "#c8db69";
          }
          else if (d.obj.grape === "Tempranillo") {
            return "#a11616";
          }
          else if (d.obj.grape === "Tannat") {
            return "#691949";
          }
          else {
            return "#e6e6e6"
          }
        })
//         .on("click", function(d, i) {
//           add_graph(d.properties.name);
//         })
        .on("mouseover", function(d, i) {
          add_highlight(d);
        })
        .on("mouseout", function(d, i) {
          d3.select("#curr_country_name").remove();
          d3.select("#curr_country_grape").remove();
          d3.select("#curr_country_action").remove();
        });
//       }
  };
//
//   var add_legend = function() {
//     var circle_attrs = [
//       { x_axis: 10, y_axis: 30, radius: 5, color: "#e41a1c", type: "Red Wine" },
//       { x_axis: 10, y_axis: 50, radius: 5, color: "#377eb8", type: "White Wine" }
//     ];
//
//     // Add legend circles
//     var circles = svg2
//       .selectAll("circle")
//       .data(circle_attrs)
//       .enter()
//       .append("circle")
//       .attr("cx", function(d) {
//         return d.x_axis;
//       })
//       .attr("cy", function(d) {
//         return d.y_axis;
//       })
//       .attr("r", function(d) {
//         return d.radius;
//       })
//       .style("fill", function(d) {
//         return d.color;
//       });
//
//     // Add legend text
//     var label_attrs = [
//       { x_axis: 20, y_axis: 0, text: "Wine Types", fontweight: "bold" },
//       { x_axis: 20, y_axis: 20, text: "Red Wine", fontweight: "normal" },
//       { x_axis: 20, y_axis: 40, text: "White Wine", fontweight: "normal" }
//     ];
//
//     svg2
//       .selectAll("text")
//       .data(label_attrs)
//       .enter()
//       .append("text")
//       .attr("y", function(d) {
//         return d.y_axis;
//       })
//       .attr("x", function(d) {
//         return d.x_axis;
//       })
//       .attr("dy", "1em")
//       .style("font-weight", function(d) {
//         return d.fontweight;
//       })
//       .text(function(d) {
//         return d.text;
//       });
  };
//
  var public = {
    add_choropleth: add_choropleth
    // ,
    // add_legend: add_legend
  };

  return public;
};

grapes_viz = grapes_viz_lib.choropleth();
grapes_viz.add_choropleth();
// grapes_viz.add_legend();

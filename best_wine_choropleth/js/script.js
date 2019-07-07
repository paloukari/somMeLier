var data = [
  {
    tosses: 5,
    catches: 4,
    size: 1.4,
    type: "Baseball"
  },
  {
    tosses: 5,
    catches: 3,
    size: 2.5,
    type: "Tennis Ball"
  },
  {
    tosses: 4,
    catches: 1,
    size: 0.5,
    type: "Bouncy Ball"
  },
  {
    tosses: 4,
    catches: 4,
    size: 6,
    type: "Soccer Ball"
  },
  {
    tosses: 5,
    catches: 4,
    size: 2.8,
    type: "Tennis Ball"
  },
  {
    tosses: 6,
    catches: 5,
    size: 0.85,
    type: "Bouncy Ball"
  },
  {
    tosses: 15,
    catches: 13,
    size: 1.9,
    type: "Baseball"
  },
  {
    tosses: 8,
    catches: 7,
    size: 5.6,
    type: "Soccer Ball"
  },
  {
    tosses: 9,
    catches: 8,
    size: 5.9,
    type: "Soccer Ball"
  },
  {
    tosses: 10,
    catches: 8,
    size: 2.2,
    type: "Baseball"
  },
  {
    tosses: 10,
    catches: 7,
    size: 2.7,
    type: "Tennis Ball"
  },
  {
    tosses: 12,
    catches: 10,
    size: 1,
    type: "Bouncy Ball"
  },
  {
    tosses: 13,
    catches: 10,
    size: 1.6,
    type: "Baseball"
  },
  {
    tosses: 15,
    catches: 11,
    size: 3,
    type: "Tennis Ball"
  },
  {
    tosses: 15,
    catches: 12,
    size: 1,
    type: "Bouncy Ball"
  },
  {
    tosses: 16,
    catches: 12,
    size: 2.3,
    type: "Baseball"
  },
  {
    tosses: 17,
    catches: 16,
    size: 6,
    type: "Soccer Ball"
  },
  {
    tosses: 18,
    catches: 10,
    size: 0.8,
    type: "Bouncy Ball"
  },
  {
    tosses: 19,
    catches: 14,
    size: 2,
    type: "Baseball"
  },
  {
    tosses: 18,
    catches: 15,
    size: 2,
    type: "Tennis Ball"
  }
];

var toss_catch_lib = toss_catch_lib || {};

toss_catch_lib.scatterPlot = function() {
  var svg = d3
    .select("div#dv")
    .append("svg")
    .attr("width", 320)
    .attr("height", 320);

  var svg2 = d3
    .select("div#dv")
    .append("svg")
    .attr("width", 180)
    .attr("height", 280);

  var add_scatter_plot = function() {
    var width = 230;
    var height = 230;
    var padding = 40;

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", padding)
      .attr("y", padding);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    svg
      .selectAll("path.pt")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "pt")
      .attr("d", d3.symbol().type(d3.symbolCircle))
      .attr("fill", function(d) {
        if (d.type === "Baseball") {
          return "#e41a1c";
        }
        if (d.type === "Tennis Ball") {
          return "#377eb8";
        }
        if (d.type === "Bouncy Ball") {
          return "#4daf4a";
        }
        if (d.type === "Soccer Ball") {
          return "#984ea3";
        }
      })
      .attr("transform", function(d) {
        return (
          "translate(" +
          (padding + d.size * 38.2) +
          "," +
          (height + padding - d.catches / d.tosses * 100 * 2.3) +
          ")"
        );
      })
      .on("mouseover", function(d, i) {
        d3.select(this).attr("stroke-width", 4);

        svg
          .append("text")
          .attr("id", "curr_toss_catch_stat")
          .attr("x", function() {
            return padding + d.size * 39;
          })
          .attr("y", function() {
            return height + padding - d.catches / d.tosses * 100 * 2.4;
          })
          .style("font-size", 18)
          .style("font-weight", "bold")
          .text(function() {
            return d.catches + "/" + d.tosses;
          });
      })
      .on("mouseout", function(d, i) {
        d3.select(this).attr("stroke-width", 1);

        d3.select("#curr_toss_catch_stat").remove();
      });

    d3.extent(
      data.map(function(d) {
        return d.catches / d.tosses * 100;
      })
    );

    x.domain([
      0,
      d3.max(data, function(d) {
        return +d.size;
      })
    ]);
    y.domain([
      0,
      d3.max(data, function(d) {
        return +(d.catches / d.tosses) * 100;
      })
    ]);

    var line = d3
      .line()
      .x(function(d) {
        return padding + x(d.size);
      })
      .y(function(d) {
        return padding + y(d.catches / d.tosses * 100);
      });

    // Add axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    svg
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + padding + "," + (height + padding) + ")";
      })
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + padding + "," + padding + ")";
      })
      .call(yAxis);

    // Add axes labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -2)
      .attr("x", -155)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Catch %");

    svg
      .append("text")
      .attr("y", 284)
      .attr("x", 165)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Ball Size (in)");
  };

  var add_legend = function() {
    var circle_attrs = [
      { x_axis: 10, y_axis: 30, radius: 5, color: "#e41a1c", type: "Baseball" },
      { x_axis: 10, y_axis: 50, radius: 5, color: "#377eb8", type: "Tennis Ball" },
      { x_axis: 10, y_axis: 70, radius: 5, color: "#4daf4a", type: "Bouncy Ball" },
      { x_axis: 10, y_axis: 90, radius: 5, color: "#984ea3", type: "Soccer Ball" }
    ];

    // Add legend circles
    var circles = svg2
      .selectAll("circle")
      .data(circle_attrs)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return d.x_axis;
      })
      .attr("cy", function(d) {
        return d.y_axis;
      })
      .attr("r", function(d) {
        return d.radius;
      })
      .style("fill", function(d) {
        return d.color;
      });

    // Add legend interactiveness
    circles
      .on("mouseover", function(d, i) {
        var current_catches = d3.sum(data, function(dt) {
          if (dt.type === d.type) {
            return dt.catches;
          }
        });
        var current_tosses = d3.sum(data, function(dt) {
          if (dt.type === d.type) {
            return dt.tosses;
          }
        });
        var cur_accuracy = current_catches / current_tosses * 100;

        var current_catches = d3.sum(data, function(d) {
          return d.catches;
        });
        var current_tosses = d3.sum(data, function(d) {
          return d.tosses;
        });
        var total_accuracy = current_catches / current_tosses * 100;

        svg2
          .append("text")
          .attr("x", 0)
          .attr("y", 150)
          .text(d.type + " Catch %")
          .style("font-weight", "bold")
          .attr("id", "ball-catch-perc-text")
          .style("fill", function() {
            if (cur_accuracy > total_accuracy) {
              return "green";
            } else {
              return "red";
            }
          });

        svg2
          .append("text")
          .attr("x", 35)
          .attr("y", 170)
          .attr("id", "ball-catch-perc")
          .attr("fill", function() {
            if (cur_accuracy > total_accuracy) {
              return "green";
            } else {
              return "red";
            }
          })
          .text(function() {
            return cur_accuracy.toFixed(2);
          });
      })
      .on("mouseout", function(d, i) {
        d3.select("#ball-catch-perc").remove();
        d3.select("#ball-catch-perc-text").remove();
      });

    // Add legend text
    var label_attrs = [
      { x_axis: 20, y_axis: 0, text: "Ball Types", fontweight: "bold" },
      { x_axis: 20, y_axis: 20, text: "Baseball", fontweight: "normal" },
      { x_axis: 20, y_axis: 40, text: "Tennis Ball", fontweight: "normal" },
      { x_axis: 20, y_axis: 60, text: "Bouncy Ball", fontweight: "normal" },
      { x_axis: 20, y_axis: 80, text: "Soccer Ball", fontweight: "normal" }
    ];

    svg2
      .selectAll("text")
      .data(label_attrs)
      .enter()
      .append("text")
      .attr("y", function(d) {
        return d.y_axis;
      })
      .attr("x", function(d) {
        return d.x_axis;
      })
      .attr("dy", "1em")
      .style("font-weight", function(d) {
        return d.fontweight;
      })
      .text(function(d) {
        return d.text;
      });
  };

  var add_total_avg = function() {
    svg2
      .append("text")
      .attr("x", 3)
      .attr("y", 200)
      .text("Total Catch %")
      .style("font-weight", "bold");
    svg2
      .append("text")
      .attr("x", 35)
      .attr("y", 220)
      .text(function(d) {
        var current_catches = d3.sum(data, function(d) {
          return d.catches;
        });
        var current_tosses = d3.sum(data, function(d) {
          return d.tosses;
        });
        var accuracy = current_catches / current_tosses * 100;
        return accuracy.toFixed(2);
      });
  };

  var public = {
    add_scatter_plot: add_scatter_plot,
    add_legend: add_legend,
    add_total_avg: add_total_avg
  };

  return public;
};

//scatterPlot = toss_catch_lib.scatterPlot();
//scatterPlot.add_scatter_plot();
//scatterPlot.add_legend();
//scatterPlot.add_total_avg();

var svg = d3.select("svg");
var width = 700;
var height = 350;

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var whiteColorScale = d3.scaleThreshold()
  .domain([0, 1, 2, 3, 4, 5])
  .range(d3.schemeBlues[6]);
var redColorScale = d3.scaleThreshold()
  .domain([0, 1, 2, 3, 4, 5])
  .range(d3.schemeReds[6]);

var count1 = 0;
var count2 = 0;

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, 'database.csv', function(d) {
    if (d.country != "" && d.rating != ""){
      if (d.country === "United States") {
        d.country = "USA"
      }
      data.set(d.country, {"rating": +d.rating, "type": d.types, "grape": d.grapes, "price": d.price, "name": d.name});
    }
  })
  //.defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
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
        d.obj = data.get(d.properties.name) || {"rating": 0, "type": "White wine"};

        if (data.get(d.properties.name)) {
          console.log("Wine/country found for Country ID: " + d.id + ", Country Name: " + d.properties.name)
        } else {
          console.log("No wine found for Country ID: " + d.id + ", Country Name: " + d.properties.name)
        }

        if (d.obj.type === "White wine") {
          return whiteColorScale(d.obj.rating);
        } else {
          return redColorScale(d.obj.rating);
        }
      }).on("mouseover", function(d, i) {
        d3.select(this).attr("stroke-width", 4);
        console.log(d);
        console.log(i);
        console.log("YOU ARE HOVERING!")

        // TODO: Add hovering
        //d.append("text")
        //  .attr("id", "curr_toss_catch_stat")
        //  .style("font-size", 18)
        //  .style("font-weight", "bold")
        //  .text("HELLO FRIENDS");
      });
}

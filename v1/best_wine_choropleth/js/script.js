var data2 = [
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

var wine_viz_lib = wine_viz_lib || {};

wine_viz_lib.choropleth = function() {
  var width = 700;
  var height = 350;
  var data = d3.map();
  var graph_data = [];

  var svg = d3
    .select("div#dv")
    .append("svg")
    .attr("width", width)
    .attr("height", height);;

  var svg2 = d3
    .select("div#dv")
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
      .select("div#dv")
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

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain([
      0,
      d3.max(rel_data, function(d) {
        var price = parseInt(d.price.split('$')[1].split('.')[0]);
        return +price;
      })
    ]);
    y.domain([
      0,
      d3.max(rel_data, function(d) {
        return +d.rating;
      })
    ]);

    var line = d3
      .line()
      .x(function(d) {
        var price = parseInt(d.price.split('$')[1].split('.')[0]);
        return padding + x(price);
      })
      .y(function(d) {
        return padding + y(d.rating);
      });

    svg
      .selectAll("path.pt")
      .data(rel_data)
      .enter()
      .append("path")
      .attr("class", "pt")
      .attr("d", d3.symbol().type(d3.symbolCircle))
      .attr("fill", function(d) {
        if (d.types === "White wine") {
          return "#377eb8";
        } else {
          return "#e41a1c";
        }
      })
      .attr("transform", function(d) {
        var price = parseInt(d.price.split('$')[1].split('.')[0]);
        return ("translate(" + (padding + x(price)) + "," + (padding + y(d.rating)) + ")");
      })
      .on("mouseover", function(d, i) {
        d3.select(this).attr("stroke-width", 3);

        svg
          .append("text")
          .attr("id", "curr_toss_catch_stat")
          .attr("x", function() {
            var price = parseInt(d.price.split('$')[1].split('.')[0]);
            return padding + x(price) + 6;
          })
          .attr("y", function() {
            return padding + y(d.rating) - 2;
          })
          .style("font-size", 18)
          .style("font-weight", "bold")
          .text(function() {
            return d.name;
          });
      })
      .on("mouseout", function(d, i) {
        d3.select(this).attr("stroke-width", 1);
        d3.select("#curr_toss_catch_stat").remove();
      });

    // Add axes
    var xAxis = d3.axisBottom(x).ticks(9);
    var yAxis = d3.axisLeft(y);
    svg
      .append("g")
      .attr("transform", function() {
        return "translate(" + padding + "," + (height + padding) + ")";
      })
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", function() {
        return "translate(" + padding + "," + padding + ")";
      })
      .call(yAxis);

    // Add axes labels
    svg
      .append("text")
      .data(rel_data)
      .attr("y", 10)
      .attr("x", 160)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(function(d){ return d.country + " Wine Rating vs. Price" });

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -3)
      .attr("x", -155)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Rating");

    svg
      .append("text")
      .attr("y", 284)
      .attr("x", 165)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price (USD)");
  };

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
      .text(function() {
        return "Type: " + d.obj.grape;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_rating")
      .attr("x", 0)
      .attr("y", 240)
      .style("font-size", 14)
      .text(function() {
        return "Rating: " + d.obj.rating;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_price")
      .attr("x", 0)
      .attr("y", 260)
      .style("font-size", 14)
      .text(function() {
        var price = parseInt(d.obj.price.split('$')[1].split('.')[0]);
        return "Price: $" + price;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_action")
      .attr("x", 0)
      .attr("y", 300)
      .style("font-size", 14)
      .style("font-style", "italic")
      .text("Click to learn more.");
  };

  var add_choropleth = function() {
    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(100)
      .center([0,20])
      .translate([width / 2, height / 2]);

    // Data and color scale
    var whiteColorScale = d3.scaleThreshold()
      .domain([0, 3.5, 4, 4.5, 5])
      .range(d3.schemeBlues[5]);
    var redColorScale = d3.scaleThreshold()
      .domain([0, 3.5, 4, 4.5, 5])
      .range(d3.schemeReds[5]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, 'database.csv', function(d) {
        if (d.country != "" && d.rating != ""){
          if (d.country === "United States") {
            d.country = "USA"
          }
          var curr = data.get(d.country) || {"rating": 0, "type": "White wine"};
          if (+d.rating > +curr.rating) {
            data.set(d.country, {"rating": +d.rating, "type": d.types, "grape": d.grapes, "price": d.price, "name": d.name});
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
          d.obj = data.get(d.properties.name) || {"rating": 0, "type": "White wine"};

          if (d.obj.type === "White wine") {
            return whiteColorScale(d.obj.rating);
          } else {
            return redColorScale(d.obj.rating);
          }
        })
        .on("click", function(d, i) {
          add_graph(d.properties.name);
        })
        .on("mouseover", function(d, i) {
          add_highlight(d);
        })
        .on("mouseout", function(d, i) {
          d3.select("#curr_country_name").remove();
          d3.select("#curr_country_grape").remove();
          d3.select("#curr_country_rating").remove();
          d3.select("#curr_country_price").remove();
          d3.select("#curr_country_action").remove();
        });
      }
  };

  var add_legend = function() {
    var circle_attrs = [
      { x_axis: 10, y_axis: 30, radius: 5, color: "#e41a1c", type: "Red Wine" },
      { x_axis: 10, y_axis: 50, radius: 5, color: "#377eb8", type: "White Wine" }
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

    // Add legend text
    var label_attrs = [
      { x_axis: 20, y_axis: 0, text: "Wine Types", fontweight: "bold" },
      { x_axis: 20, y_axis: 20, text: "Red Wine", fontweight: "normal" },
      { x_axis: 20, y_axis: 40, text: "White Wine", fontweight: "normal" }
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

  var public = {
    add_choropleth: add_choropleth,
    add_legend: add_legend
  };

  return public;
};

wine_viz = wine_viz_lib.choropleth();
wine_viz.add_choropleth();
wine_viz.add_legend();

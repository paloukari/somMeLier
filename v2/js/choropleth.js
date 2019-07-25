var wine_viz_lib = wine_viz_lib || {};

wine_viz_lib.choropleth = function () {
  var width = 700;
  var height = 350;
  var data = d3.map();
  var graph_data = [];

  var svg = d3
    .select("div#choropleth")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var svg2 = d3
    .select("div#choropleth")
    .append("svg")
    .attr("width", 280)
    .attr("height", 350)
    .style("display", "inline-block")
    .style("padding-left", "5px");

  var add_highlight = function (d) {
    svg2
      .append("text")
      .attr("id", "curr_country_name")
      .attr("x", 0)
      .attr("y", 200)
      .style("font-size", 18)
      .style("font-weight", "bold")
      .text(function () {
        return d.properties.name;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_grape")
      .attr("x", 0)
      .attr("y", 220)
      .style("font-size", 14)
      .text(function () {
        return "Type: " + d.obj.grape;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_rating")
      .attr("x", 0)
      .attr("y", 240)
      .style("font-size", 14)
      .text(function () {
        return "Highest Wine Rating: " + d.obj.rating;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_price")
      .attr("x", 0)
      .attr("y", 260)
      .style("font-size", 14)
      .text(function () {
        if (d.obj.price) {
          var price = parseInt(d.obj.price.split('$')[1].split('.')[0]);
          return "Best Wine Price: $" + price;
        }
        else
          return "No price for this selection";
      });
    svg2
      .append("text")
      .attr("id", "curr_country_action")
      .attr("x", 0)
      .attr("y", 300)
      .style("font-size", 14)
      .style("font-style", "italic")
      .text("Click to add country filter.");
  };

  var add_choropleth = function () {
    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
      .scale(100)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    // Data and color scale
    var whiteColorScale = d3.scaleThreshold()
      .domain([0, 3.5, 4, 4.4, 5])
      .range(d3.schemeBlues[5]);
    var redColorScale = d3.scaleThreshold()
      .domain([0, 3.5, 4, 4.4, 5])
      .range(d3.schemeReds[5]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, 'data/database.csv', function (d) {
        if (d.country != "" && d.rating != "") {
          if (d.country === "United States") {
            d.country = "USA"
          }
          var curr = data.get(d.country) || { "rating": 0, "type": "White wine" };
          if (+d.rating > +curr.rating) {
            data.set(d.country, { "rating": +d.rating, "type": d.types, "grape": d.grapes, "price": d.price, "name": d.name });
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
          d.obj = data.get(d.properties.name) || { "rating": 0, "type": "White wine" };

          if (d.obj.type === "White wine") {
            return whiteColorScale(d.obj.rating);
          } else {
            return redColorScale(d.obj.rating);
          }
        })
        .on("click", function (d, i) {
          $('.chosen-select').val(d.properties.name).trigger('chosen:updated');
        })
        .on("mouseover", function (d, i) {
          add_highlight(d);
        })
        .on("mouseout", function (d, i) {
          d3.select("#curr_country_name").remove();
          d3.select("#curr_country_grape").remove();
          d3.select("#curr_country_rating").remove();
          d3.select("#curr_country_price").remove();
          d3.select("#curr_country_action").remove();
        });
    }
  };

  var add_legend = function () {
    var circle_attrs = [
      { x_axis: 10, y_axis: 50, radius: 5, color: "#e41a1c", type: "Red Wine" },
      { x_axis: 10, y_axis: 80, radius: 5, color: "#377eb8", type: "White Wine" }
    ];

    // Add legend circles
    var circles = svg2
      .selectAll("circle")
      .data(circle_attrs)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return d.x_axis;
      })
      .attr("cy", function (d) {
        return d.y_axis;
      })
      .attr("r", function (d) {
        return d.radius;
      })
      .style("fill", function (d) {
        return d.color;
      });

    // Add legend text
    var label_attrs = [
      { x_axis: 20, y_axis: 0, text: "Wine Types", fontweight: "bold" },
      { x_axis: 20, y_axis: 30, text: "Red Wine", fontweight: "normal" },
      { x_axis: 20, y_axis: 60, text: "White Wine", fontweight: "normal" }
    ];

    svg2
      .selectAll("text")
      .data(label_attrs)
      .enter()
      .append("text")
      .attr("y", function (d) {
        return d.y_axis;
      })
      .attr("x", function (d) {
        return d.x_axis;
      })
      .attr("dy", "1em")
      .style("font-weight", function (d) {
        return d.fontweight;
      })
      .style("left", "0px")
      .text(function (d) {
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

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
    .attr("width", 650)
    .attr("height", 125)
    .style("float", "left")
    .style("padding-left", "5px");

  var add_highlight = function (d) {
    svg2
      .append("text")
      .attr("id", "curr_country_name")
      .attr("x", 350)
      .attr("y", 20)
      .style("font-size", 18)
      .style("float", "right")
      .style("font-weight", "bold")
      .text(function () {
        return d.properties.name;
      });
    svg2
      .append("text")
      .attr("id", "curr_country_wine")
      .attr("x", 350)
      .attr("y", 40)
      .style("font-size", 14)
      .style("float", "right")
      .text(function () {
        if (d.obj.name) {
          return "Best Wine: " + d.obj.name;
        }
        return "No wine for this country."
      });
    svg2
      .append("text")
      .attr("id", "curr_country_grape")
      .attr("x", 350)
      .attr("y", 60)
      .style("font-size", 14)
      .style("float", "right")
      .text(function () {
        if (d.obj.grape) {
          return "Type: " + d.obj.grape;
        }
        return "No grape for this country."
      });
    svg2
      .append("text")
      .attr("id", "curr_country_rating")
      .attr("x", 350)
      .attr("y", 80)
      .style("font-size", 14)
      .style("float", "right")
      .text(function () {
        if (d.obj.price) {
          return "Highest Wine Rating: " + d.obj.rating;
       }
       return "No rating for this country."
      });
    svg2
      .append("text")
      .attr("id", "curr_country_price")
      .attr("x", 350)
      .attr("y", 100)
      .style("font-size", 14)
      .style("float", "right")
      .text(function () {
        if (d.obj.price) {
          var price = parseInt(d.obj.price.split('$')[1].split('.')[0])/4;
          return "Best Wine Price: $" + price;
        }
        return "No price for this country.";
      });
    svg2
      .append("text")
      .attr("id", "curr_country_action")
      .attr("x", 350)
      .attr("y", 120)
      .style("font-size", 14)
      .style("float", "right")
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
      .domain([0, 4, 4.4, 5])
      .range(d3.schemeBlues[4]);
    var redColorScale = d3.scaleThreshold()
      .domain([0, 4, 4.4, 5])
      .range(d3.schemeReds[4]);

    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .defer(d3.csv, 'static/data/database.csv', function (d) {
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
          d3.select("#curr_country_wine").remove();
        });
    }
  };

  var add_legend = function () {
    // Data and color scale
    var whiteColorScale = d3.scaleThreshold()
      .domain([0, 4, 4.4, 5])
      .range(d3.schemeBlues[4]);
    var redColorScale = d3.scaleThreshold()
      .domain([0, 4, 4.4, 5])
      .range(d3.schemeReds[4]);

    var circle_attrs = [
      { x_axis: 110, y_axis: 40, radius: 7, color: "0", type: "Red Wine"},
      { x_axis: 130, y_axis: 40, radius: 7, color: "4.1", type: "Red Wine"},
      { x_axis: 150, y_axis: 40, radius: 7, color: "4.5", type: "Red Wine"},
      { x_axis: 110, y_axis: 80, radius: 7, color: "0", type: "White Wine"},
      { x_axis: 130, y_axis: 80, radius: 7, color: "4.1", type: "White Wine"},
      { x_axis: 150, y_axis: 80, radius: 7, color: "4.5", type: "White Wine"}
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
        if (d.type == "White Wine") {
          return whiteColorScale(d.color);
        } else {
          return redColorScale(d.color);
        }
      });

    // Add legend text
    var label_attrs = [
      { x_axis: 20, y_axis: 0, text: "Best Wine Rating", fontsize: 18, fontweight: "bold" },
      { x_axis: 20, y_axis: 30, text: "Red Wine", fontsize: 14, fontweight: "normal" },
      { x_axis: 20, y_axis: 70, text: "White Wine", fontsize: 12, fontweight: "normal" },
      { x_axis: 106, y_axis: 50, text: "<4", fontsize: 12, fontweight: "normal" },
      { x_axis: 126, y_axis: 50, text: ">4", fontsize: 12, fontweight: "normal" },
      { x_axis: 142, y_axis: 50, text: ">4.5", fontsize: 12, fontweight: "normal" }
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
      .style("font-size", function(d) {
        return d.fontsize;
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
